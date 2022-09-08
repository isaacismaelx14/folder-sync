import { Router } from "express";
import { Check, CheckDelete } from "../controllers/check";

const router = Router();
const checkCtrl = new Check();
const checkDeleteCtrl = new CheckDelete();

router.post("/", checkCtrl.post);
router.post("/deleted", checkDeleteCtrl.post);
 
export default router;