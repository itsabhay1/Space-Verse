import {Router} from "express";
import { placeOrRearrangeItem } from "../controllers/placement.controller.js";

const router = Router();

router.route("/").post(placeOrRearrangeItem);
export default router;
    