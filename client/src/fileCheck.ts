import path from "path";
import fs from "fs";
import config from "./config";

interface IFileData {
    name: string;
    contentSize: number;
    size: number;
}

const dir = config.folder;
createFolder(dir);

function createFolder(folder: string) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
}

function currentFiles(): IFileData[] {
    const files: IFileData[] = [];
    const filesnames = fs.readdirSync(dir);

    filesnames.forEach((file) => {
        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isFile()) {
            files.push({
                name: file,
                size: fileStat.size,
                contentSize: fs.readFileSync(filePath).toString().length,
            });
        }
    });

    return files;
}

export {
    currentFiles,
}