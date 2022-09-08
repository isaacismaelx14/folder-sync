import fs from "fs";
import path from "path";
import axios from "axios";
import config from "./config";
import unzipper from 'unzipper';
import { currentFiles } from "./fileCheck";

const tempPath = config.folder;
const link = 'http://localhost:4000';

async function checkToDelete() {
    const toDelete = await axios.post(`${link}/check/deleted`, { files: currentFiles() });
    if (toDelete.status !== 200) return console.log("all is ok no to delete");
    const files = toDelete.data;

    const deleteFiles = files.map((file: any) => {
        return new Promise((resolve, reject) => {
            fs.unlink(path.join(tempPath, file.name), (err) => {
                if (err) reject(err);
                resolve(file);
            });
        });
    });

    const data = await Promise.all(deleteFiles);
    const numbDelete = data.length;
    if (numbDelete > 0) console.log(`${numbDelete} files deleted`);
}

async function checkFiles() {
    const getData = await axios.post(`${link}/check`, { files: currentFiles() }, {
        responseType: "stream",
    })

    if (getData.status !== 200) return console.log("all is ok");
    const zipFile = path.join(__dirname, "temp.zip");
    const stream = fs.createWriteStream(zipFile)
    getData.data.pipe(stream);

    stream.on("finish", function () {
        const zipStream = fs.createReadStream(zipFile).pipe(unzipper.Extract({ path: tempPath }));

        zipStream.on('close', function () {
            fs.unlinkSync(zipFile);
            console.log('done');
        }
        );
    });
}

(async () => {
    await checkToDelete();
    await checkFiles();
})();
