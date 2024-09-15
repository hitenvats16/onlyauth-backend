import Joi from 'joi'

import DashboardService from './service.js'
import codes from '../../common/constants/codes.js'
import logger from '../../common/utils/logger.js'
import ALLOWED_SCOPES from '../../common/constants/scopes.js'

export default class DashbaordController {
  constructor() {
    this.service = new DashboardService()
  }

  async listApplications(req, res) {
    const { user } = req
    const applications = await this.service.findApplications(user)

    return res.json({
      applications: applications.map(this.createAppResponseObject),
    })
  }

  async createApplication(req, res) {
    const { user } = req
    const schema = Joi.object({
      name: Joi.string().min(5).max(256).required(),
      redirectUris: Joi.array()
        .items(Joi.string().regex(/^(https?:\/\/)/))
        .min(1)
        .required(),
      origins: Joi.array()
        .items(Joi.string().regex(/^(https?:\/\/)/))
        .default([]),
      allowedScopes: Joi.array()
        .items(Joi.string().valid(...Object.values(ALLOWED_SCOPES)))
        .required(),
      consentScreen: Joi.object({
        name: Joi.string().min(5).max(256).required(),
        title: Joi.string().min(5).max(256).required(),
        developerEmail: Joi.string().email().required(),
        appAddress: Joi.string()
          .regex(/^(https?:\/\/[^\s/$.?#].[^\s]*)$/)
          .required(),
        description: Joi.string().default(null),
        logo: Joi.string().default(null),
        message: Joi.string().default(null),
      }).required(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return res
        .status(400)
        .json({ error: error.message, code: codes.SCHEMA_ERROR })
    }

    const payload = value
    payload.secret = this.service.createSecret()
    payload.clientId = await this.service.createClientId()

    logger.log('Creating application with payload', payload)

    let application = await this.service.createApplication(user, payload)
    application = await this.service.findApplication(user, application.id)

    return res.json({
        application: this.createAppResponseObject(application)
    })
  }

  async updateApplication(req, res) {
    let { id } = req.params
    const { user } = req
    const schema = Joi.object({
      name: Joi.string().min(5).max(256),
      redirectUris: Joi.array()
        .items(Joi.string().regex(/^(https?:\/\/)/))
        .min(1),
      origins: Joi.array()
        .items(Joi.string().regex(/^(https?:\/\/)/)),
      allowedScopes: Joi.array()
        .items(Joi.string().valid(...Object.values(ALLOWED_SCOPES))),
      consentScreen: Joi.object({
        name: Joi.string().min(5).max(256),
        title: Joi.string().min(5).max(256),
        developerEmail: Joi.string().email(),
        appAddress: Joi.string()
          .regex(/^(https?:\/\/[^\s/$.?#].[^\s]*)$/),
        description: Joi.string(),
        logo: Joi.string(),
        message: Joi.string(),
      }),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return res
        .status(400)
        .json({ error: error.message, code: codes.SCHEMA_ERROR })
    }

    const payload = value

    logger.log('Updating application with payload', payload)

    await this.service.updateApplication(user, id, payload)

    return res.json({ message: 'Application updated successfully', keysUpdated: this.listKeys(payload) })
  }

  createAppResponseObject(app) {
    return {
      id: app.id,
      name: app.name,

      secret: app.secret,
      redriectUris: app.redirectUris,
      origins: app.origins,
      allowedScopes: app.allowedScopes,
      clientId: app.clientId,
      isTrusted: app.isTrusted,

      state: app.state,
      consentScreen: {
        name: app.consentScreen.name,
        logo: app.consentScreen.logo,
        title: app.consentScreen.title,
        description: app.consentScreen.description,
        developerEmail: app.consentScreen.developerEmail,
        appAddress: app.consentScreen.appAddress,
        message: app.consentScreen.message,
      },

      createdAt: parseInt((app.createdAt.valueOf() / 1000).toFixed(0)),
      updatedAt: parseInt((app.updatedAt.valueOf() / 1000).toFixed(0)),
    }
  }

  listKeys(object){
    const keys = []

    function getKeys(obj, prefix = '') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = prefix ? `${prefix}.${key}` : key
          keys.push(newKey)
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            getKeys(obj[key], newKey)
          }
        }
      }
    }

    getKeys(object)
    return keys
  }
}
