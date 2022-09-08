import { Request, Response } from "express";
import { checkFiles, checkFilesToDelete } from "../functions/fileCheck";

export class Check {
    async post(req: Request, res: Response) {
        const files = req.body.files;

        if (!files) {
            return res.status(400).send('files is required');
        }

        const fileRouter = await checkFiles(files);

        if (fileRouter) {
            res.download(fileRouter);
            return;
        }

        res.status(204).send('all files are up to date');
    }
}

export class CheckDelete {
    async post(req: Request, res: Response) {
        const files = req.body.files;

        if (!files) {
            return res.status(400).send('files is required');
        }

        const fileRouter = checkFilesToDelete(files);
        if (fileRouter) {
            res.status(200).send(fileRouter);
            return;
        }

        res.status(204).send('all files are up to date');
    }
}
