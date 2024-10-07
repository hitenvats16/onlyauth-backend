import jwt from 'jsonwebtoken'

import config from '../../common/config.js'
import db from '../../common/db/index.js'

export default class ResourceService {
  checkAccessToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      return decoded
    } catch (error) {
      return null
    }
  }

  async findUserById(userId) {
    return db.user.findUnique({
      where: {
        id: userId,
      },
    })
  }

  async signPayload(payload, secret) {
    return jwt.sign(payload, secret, {
      expiresIn: 60,
    })
  }

  async findAppById(appId) {
    return db.app.findUnique({
      where: {
        id: appId,
      },
    })
  }
}
