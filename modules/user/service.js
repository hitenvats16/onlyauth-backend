import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import db from '../../common/db/index.js'
import config from '../../common/config.js'
import logger from '../../common/utils/logger.js'
import { ResponseError } from '../../common/errors.js'
import codes from '../../common/codes.js'

const DEFAULT_KEY_LEN = 64

export default class UserService {
  async createUser({ fullName, email, password, picture }) {
    const doesUserExist = Boolean(await this.findUserByEmail(email))

    if (doesUserExist) {
      throw new ResponseError('User already exists',codes.USER_ALREADY_EXISTS)
    }

    const userCreatePayload = {
      picture: picture || null,
      email,
      fullName,
    }

    userCreatePayload.salt = crypto.randomBytes(16).toString('hex')
    userCreatePayload.passwordHash = this.generatePaswordHash(password, userCreatePayload.salt)

    logger.log('Creating user with payload', userCreatePayload)

    const user = await db.user.create({
      data: userCreatePayload,
    })

    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        picture: user.picture,
    }
  }

  async generateAccessToken({ email, password }) {
    const user = await this.findUserByEmail(email)

    if (!user) {
      throw new Error('User not found')
    }

    if (!this.comparePassword(password, user.salt, user.passwordHash)) {
      throw new ResponseError('Invalid password',codes.INVALID_PASSWORD)
    }

    const accessToken = jwt.sign(
        {
            email: user.email,
            id: user.id,
            fullName: user.fullName,
            picture: user.picture,
        },
        config.jwt.secret,
        {
            expiresIn: '7d'
        }
    )

    return accessToken
  }

  async getUserDetails(id) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    })

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      picture: user.picture,
    }}

  async findUserByEmail(email) {
    const user = await db.user.findFirst({
      where: {
        email,
        isDeleted: false
      },
    })
    if (!user) {
      new ResponseError('User not found',codes.USER_NOT_FOUND)
    }
    return user
  }

  generatePaswordHash(password, salt) {
    return crypto.scryptSync(password, salt, DEFAULT_KEY_LEN,{
        N: config.scryptOptions.N,
        r: config.scryptOptions.r,
        p: config.scryptOptions.p,
    }).toString('hex')
  }

  comparePassword(password, salt, passwordHash) {
    return this.generatePaswordHash(password, salt) === passwordHash
  }
}
