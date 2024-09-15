import Joi from 'joi'

import ALLOWED_SCOPES from '../../common/constants/scopes.js'
import codes from '../../common/constants/codes.js'
import OperationsService from './service.js'
import logger from '../../common/utils/logger.js'
import { getTimeAfterSeconds } from '../../common/utils/time.js'

export default class OperationsController {
  constructor() {
    this.service = new OperationsService()
    this.TOKEN_EXPIRE_TIME = 15 // 15 seconds
  }

  async grantAccess(req, res) {
    const schema = Joi.object({
      scopes: Joi.array()
        .items(Joi.string().valid(...Object.values(ALLOWED_SCOPES)))
        .required(),
      redirectUri: Joi.string().uri().required(),
      clientId: Joi.string().required(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return res
        .status(400)
        .json({ error: error.message, code: codes.SCHEMA_ERROR })
    }

    const { clientId, redirectUri, scopes } = value
    const app = await this.service.findApplicationByClientId(clientId)

    if (!app) {
      return res
        .status(400)
        .json({ error: 'Client Id is invalid', code: codes.INVALID_CLIENT })
    }

    if (!app.redirectUris.includes(redirectUri)) {
      return res
        .status(400)
        .json({
          error: 'Redirect Url is invalid',
          code: codes.INVALID_REDIRECT,
        })
    }

    const tokenMapping = await this.service.createTokenEntry(app, {
      scopes,
      user: req.user,
    })

    logger.log('Created token mapping', tokenMapping)
    const url = new URL(redirectUri)
    url.searchParams.set('token', encodeURIComponent(tokenMapping.token))
    logger.log('Redirecting to', url.toString())
    return res.redirect(url)
  }

  async getAccessToken(req, res) {
    const schema = Joi.object({
      token: Joi.string().required(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return res
        .status(400)
        .json({ error: error.message, code: codes.SCHEMA_ERROR })
    }

    const { token } = value
    const tokenMapping = await this.service.findTokenMappingByToken(token)

    if (!tokenMapping || getTimeAfterSeconds(tokenMapping.createdAt,this.TOKEN_EXPIRE_TIME) > new Date()) {
      return res
        .status(400)
        .json({ error: 'Token is invalid', code: codes.TOKEN_EXPI })
    }

    const payload = {
        appId: tokenMapping.appId,
        scopes: tokenMapping.data.scopes,
        userId: tokenMapping.data.user.id,
    }

    const accessToken = this.service.generateAccessToken(payload)

    await this.service.deleteTokenMapping(tokenMapping)
    logger.log('Deleted token mapping', tokenMapping)

    return res.json({ accessToken })
  }
}
