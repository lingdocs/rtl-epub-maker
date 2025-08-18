import { extname, join } from "path";
import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import { deleteFile } from "@/lib/backend-file-utils";
export const dynamic = "force-static";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file || typeof file !== "object") {
    return Response.json(
      { ok: false, problem: "file(s) needed" },
      { status: 400 },
    );
  }
  // save tmp file
  const arrBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrBuffer);
  if (!fs.existsSync("tmp")) {
    fs.mkdirSync("tmp");
  }
  await fs.promises.writeFile(path.join("tmp", file.name), buffer);
  const isWordDoc = extname(file.name).startsWith(".doc");
  const markdown = await (isWordDoc ? convertWordDoc : getTextDoc)(file.name);
  return Response.json({ markdown });
}

async function getTextDoc(doc: string) {
  const data = await fs.promises.readFile(join("tmp", doc), "utf8");
  deleteFile(join("tmp", doc));
  return data;
}

function convertWordDoc(doc: string) {
  return new Promise((resolve, reject) => {
    const outputName = doc + ".md";
    const pandoc = spawn("pandoc", [
      "-s",
      join("tmp", doc),
      "-t",
      "markdown",
      "-o",
      join("tmp", outputName),
    ]);
    pandoc.on("error", (err) => {
      console.error("error converting word document");
      console.error(err);
      reject();
    });
    pandoc.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    pandoc.on("close", (code) => {
      if (code === 0) {
        const text = fs.readFileSync(join("tmp", outputName), "utf8");
        deleteFile(join("tmp", outputName), join("tmp", doc));
        resolve(text);
      } else {
        reject();
      }
    });
  });
}
