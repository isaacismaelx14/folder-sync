import path from "path";
import fs from "fs";
import jszip from "jszip";
import config from "../config";

interface IFileData {
  name: string;
  content: Buffer;
  size: number;
  contentSize: number;
}

const dir = config.folder;
const zipFile = config.zipFile;

createFolder(dir);

function createFolder(folder: string) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
}

function currentFiles() {
  const files: IFileData[] = [];
  const filesnames = fs.readdirSync(dir);

  filesnames.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isFile()) {
      files.push({
        name: file,
        size: fileStat.size,
        content: fs.readFileSync(filePath),
        contentSize: fs.readFileSync(filePath).toString().length,
      });
    }
  });

  return files;
}

function getDiff(lFiles: IFileData[]): IFileData[] {
  const cFiles = currentFiles();
  const sFiles = [];
  let dFiles: IFileData[] = [];
  if (lFiles.length === 0) dFiles = cFiles;

  cFiles.forEach((cFile) => {
    const sameFile = lFiles.find((lFile) => lFile.name === cFile.name && lFile.size === cFile.size && lFile.content === cFile.content);
    if (sameFile) {
      sFiles.push(sameFile);
    } else {
      dFiles.push(cFile);
    }
  });

  return dFiles ? dFiles : [];
}

async function checkFiles(lFiles: IFileData[]) {
  const differentsFiles = getDiff(lFiles);

  if (differentsFiles.length > 0) {
    const zip = new jszip();

    differentsFiles.forEach((file) => {
      zip.file(file.name, file.content);
    });

    const content = await zip.generateAsync({ type: "nodebuffer" })
    fs.writeFileSync(zipFile, content);
  }

  return differentsFiles.length > 0 ? zipFile : null;

}

function checkFilesToDelete(lFiles: IFileData[]) {
  const cFiles = currentFiles();
  const dFiles: IFileData[] = [];

  lFiles.forEach((lFile) => {
    const sameFile = cFiles.find((cFile) => cFile.name === lFile.name && cFile.size === lFile.size && lFile.content === cFile.content);

    if (!sameFile) {
      dFiles.push(lFile);
    }
  });

  return dFiles;
}

export {
  checkFiles,
  checkFilesToDelete,
}