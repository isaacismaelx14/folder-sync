import { join } from "path";

const dir = (...last:string[]) => join(__dirname, "..", "temp", ...last);

export default {
    port: 4000,
    folder: dir("files"),
    zipFile: dir("test.zip"),
}