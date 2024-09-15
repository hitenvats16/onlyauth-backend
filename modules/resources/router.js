import { Router } from 'express'

import ResourcesController from './controller.js'
import ResourceMiddleware from './middleware.js'
import ALLOWED_SCOPES from '../../common/constants/scopes.js'

const router = Router()
const resourceController = new ResourcesController()
const middleware = new ResourceMiddleware()

router.get(
  '/user-profile',
  middleware.validatesAccessToken.bind(middleware),
  middleware.checkScopes.bind(middleware)([ALLOWED_SCOPES.PROFILE]),
  resourceController.userProfile.bind(resourceController)
)

export default router
