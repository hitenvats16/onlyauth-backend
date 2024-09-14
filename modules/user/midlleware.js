import jwt from 'jsonwebtoken'
import config from '../../common/config.js'
import logger from '../../common/utils/logger.js'
import codes from '../../common/codes.js'
import UserService from './service.js'

export default class UserMiddleware {
  constructor() {
    this.userService = new UserService()
  }
  async attachUser(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ error: 'Unauthorized', code: codes.UNAUTHORIZED })
      return
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret)

      logger.log('Decoded token', decoded)

      const user = await this.userService.findUserByEmail(decoded.email)

      if (!user) {
        throw new Error('User not found')
      }

      req.user = decoded

      next()
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized', code: codes.UNAUTHORIZED })
    }
  }
}
