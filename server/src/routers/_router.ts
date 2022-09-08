import { Router } from "express";
import Check from "./check";

const router = Router();
router.use("/check", Check);

export default router;