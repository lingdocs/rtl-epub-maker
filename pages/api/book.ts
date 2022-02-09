import nextConnect from "next-connect";
import { NextApiResponse } from "next";
import writeYamlFile from "write-yaml-file";
import { statSync, createReadStream, writeFileSync, readFileSync } from "fs";
import { spawn } from "child_process";
import { join } from "path";
import { deleteFile } from "../../lib/backend-file-utils";
import multer from "multer";

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
  const coverFile = (req.files[0] as Express.Multer.File);
  const cover = coverFile ? join("tmp", coverFile.filename) : undefined;
  const content = req.body.content as string;
  const frontmatter = JSON.parse(req.body.frontmatter) as Frontmatter;
  makeEpub(content, frontmatter, cover, (err, toDownload) => {
    if (err || !toDownload) throw err;
    const stat = statSync(toDownload);
    // express res.download doesn't work with next-connect
    res.writeHead(200, {
        'Content-Type': 'application/epub+zip',
        'Content-Length': stat.size,
        'Content-Disposition': "attacment",
    });
    const readStream = createReadStream(toDownload);
    readStream.pipe(res);
    readStream.on("close", () => {
      deleteFile(toDownload);
    });
  });
});

export default route;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function makeEpub(content: string, frontmatter: Frontmatter, cover: string | undefined, callback: (err: any, toDownload?: string) => void) {
  const ts = new Date().getTime().toString();
  const mdFile = join("tmp", `${ts}.md`);
  const yamlFile = join("tmp", `${ts}.yaml`);
  const epubFile = join("tmp", `${ts}.epub`);
  if (cover) {
    frontmatter["epub-cover-image"] = cover;
    frontmatter["cover-image"] = cover;
  }
  writeFileSync(mdFile, content, "utf-8");
  await writeYamlFile(yamlFile, frontmatter);
  writeFileSync(yamlFile, `
---
${readFileSync(yamlFile, "utf-8")}
---    
`, "utf8");
  const pandoc = spawn("pandoc", [
    "--table-of-contents",
    "--css",
    join("templates", "book.css"),
    "-o",
    epubFile,
    yamlFile,
    mdFile,
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
      callback(null, epubFile);
    } else {
      callback("error making epub with pandoc");
    }
    deleteFile(mdFile, yamlFile, cover);
  });
}