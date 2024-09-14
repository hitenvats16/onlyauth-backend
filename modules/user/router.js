import { Router } from "express";

import UserController from "./controller.js";
import UserMiddleware from "./midlleware.js";

const controller = new UserController()
const middleware = new UserMiddleware()
const router = Router();

router.post('/signup',controller.createUser.bind(controller))
router.post('/login',controller.generateAccessToken.bind(controller))
router.get('/',middleware.attachUser.bind(middleware),controller.getUser.bind(controller))

export default router