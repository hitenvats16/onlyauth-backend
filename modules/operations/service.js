import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import db from '../../common/db/index.js'
import config from '../../common/config.js'

export default class OperationsService {
  async findApplicationByClientId(clientId) {
    return db.app.findUnique({
      where: {
        clientId,
      },
    })
  }

  async createTokenEntry(app, data = {}) {
    return db.tokenAppMapping.create({
      data: {
        appId: app.id,
        token: await this.createUniqueToken(),
        data,
      },
    })
  }

  async findTokenMappingByToken(token) {
    return db.tokenAppMapping.findFirst({
      where: {
        token,
      },
    })
  }

  async deleteTokenMapping(tokenMapping) {
    return db.tokenAppMapping.delete({
      where: {
        id: tokenMapping.id,
      },
    })
  }

  async createUniqueToken() {
    let token = ''
    do {
      token = crypto.randomBytes(16).toString('hex')
    } while (
      await db.tokenAppMapping.findFirst({
        where: {
          token,
        },
      })
    )
    return token
  }

  generateAccessToken(payload) {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: '1h', // 1 hour
    })
    return accessToken
  }
}
