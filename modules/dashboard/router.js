import { Router } from 'express'
import DashbaordController from './controller.js'
import UserMiddleware from '../user/midlleware.js'

const controller = new DashbaordController()
const userMidlleware = new UserMiddleware()
const router = Router()

router.use(userMidlleware.attachUser.bind(userMidlleware))
router.get('/', controller.listApplications.bind(controller))
router.post('/', controller.createApplication.bind(controller))
router.post('/:id', controller.updateApplication.bind(controller))

export default router
