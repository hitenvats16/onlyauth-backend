import { Router } from "express";

import OperationsController from "./controller.js";
import UserMiddleware from "../user/midlleware.js";

const controller = new OperationsController()
const userMidlleware = new UserMiddleware()
const router = Router();

router.post('/grant',userMidlleware.attachUser.bind(userMidlleware), controller.grantAccess.bind(controller))
router.post('/token',controller.getAccessToken.bind(controller))

export default router