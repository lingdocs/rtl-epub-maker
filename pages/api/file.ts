
import nextConnect from "next-connect";
import { NextApiResponse } from "next";
import multer from "multer";
import { readFile, readFileSync } from "fs";
import { spawn } from "child_process";
import { join, extname } from "path";
import { deleteFile } from "../../lib/backend-file-utils";

const upload = multer({
  storage: multer.diskStorage({
    destination: './tmp',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

const route = nextConnect<any, NextApiResponse>({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

route.use(upload.any());
route.post((req, res) => {
  if (!Array.isArray(req.files)) {
    res.status(400).send({ ok: false, problem: "file(s) needed" });
    return;
  }
  const file = req.files[0] as Express.Multer.File;
  if (!file) {
    throw new Error("file not uploaded");
  }
  const isWordDoc = extname(file.filename).startsWith(".doc");
  (isWordDoc ? convertWordDoc : getTextDoc)(file.filename, (err, markdown) => {
    if (err) throw err;
    res.json({ markdown });
  });
});

export default route;

export const config = {
  api: {
    bodyParser: false,
  },
};

function getTextDoc(doc: string, callback: (err: any, markdown?: string) => void) {
  readFile(join("tmp", doc), "utf8", (err, data) => {
    if (err) callback(err);
    callback(null, data);
    deleteFile(join("tmp", doc));
  });
}

function convertWordDoc(doc: string, callback: (err: any, markdown?: string) => void) {
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
  });
  pandoc.stderr.on("data", data => {
    console.error(data.toString());
  });
  pandoc.on("close", (code) => {
    if (code === 0) {
      callback(null, readFileSync(join("tmp", outputName), "utf8"));
    } else {
      callback("error converting word file");
    }
    deleteFile(join("tmp", outputName), join("tmp", doc));
  });
}