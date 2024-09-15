import codes from '../../common/constants/codes.js'
import logger from '../../common/utils/logger.js'
import ResourceService from './service.js'

export default class ResourceMiddleware {
  constructor() {
    this.service = new ResourceService()
  }
  validatesAccessToken(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.split(' ')?.[1]
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized', code: codes.UNAUTHORIZED })
    }
    const decoded = this.service.checkAccessToken(token)

    if (!decoded) {
      return res
        .status(400)
        .json({ error: 'Expired token', code: codes.TOKEN_EXPI })
    }
    req.tokenData = decoded
    next()
  }
  checkScopes(scopes = []) {
    return (req, res, next) => {
      const { scopes: reqScopes } = req.tokenData
      logger.log('scopes recieved as arguments', scopes)
      logger.log('scopes from token', reqScopes)
      const hasScopes = reqScopes.every((scope) => scopes.includes(scope))
      if (!hasScopes) {
        return res
          .status(403)
          .json({ error: 'Forbidden', code: codes.FORBIDDEN })
      }
      next()
    }
  }
}
