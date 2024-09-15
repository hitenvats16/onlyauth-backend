import Joi from 'joi'

import UserService from './service.js'
import logger from '../../common/utils/logger.js'
import codes from '../../common/constants/codes.js'

export default class UserController {
  constructor() {
    this.userService = new UserService()
  }

  async createUser(req, res) {
    const schema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      /**
       * This regex ensures that a password:
         1. Is at least 8 characters long.
         2. Contains at least one lowercase letter.
         3. Contains at least one uppercase letter.
         4. Contains at least one digit.
         5. Contains at least one special character from the set @$!%*?&.
       */
      password: Joi.string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required(),
    })
    const { value, error } = schema.validate(req.body)

    if (error) {
      res.status(400).json({ error: error.message, code: codes.SCHEMA_ERROR })
      return
    }

    try {
      const user = await this.userService.createUser(value)
      res.status(201).json(user)
    } catch (err) {
      res.status(400).json({ error: err.message, error: err.code })
    }
  }

  async generateAccessToken(req, res) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })

    const { value, error } = schema.validate(req.body)

    if (error) {
      res.status(400).json({ error: error.message, code: codes.SCHEMA_ERROR })
      return
    }

    try {
      const accessToken = await this.userService.generateAccessToken(value)
      const user = await this.userService.findUserByEmail(value.email)
      logger.log('Generated access token', accessToken)
      res.status(200).json({ accessToken, user: {
        email: user.email,
        fullName: user.fullName,
        picture: user.picture
      } })
    } catch (err) {
      res.status(400).json({ error: err.message, code: err.code })
    }
  }

  async getUser(req, res) {
    const { id } = req.user
    try {
      const user = await this.userService.getUserDetails(id)
      res.status(200).json(user)
    } catch (err) {
      res.status(400).json({ error: err.message, code: err.code })
    }
  }
}
