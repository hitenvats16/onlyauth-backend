import { APP_STATE } from '@prisma/client'
import crypto from 'crypto'

import db from '../../common/db/index.js'

export default class DashboardService {
  async findApplications(user) {
    return db.app.findMany({
      where: {
        ownerId: user.id,
        state: {
          not: APP_STATE.DELETED,
        },
      },
      include: {
        consentScreen: true,
      },
    })
  }

  async createApplication(user, application) {
    return db.app.create({
      data: {
        ...application,
        ownerId: user.id,
        consentScreen: {
          create: application.consentScreen,
        },
      },
    })
  }

  async updateApplication(user, id, application) {
    return db.app.update({
      where: {
        id,
        ownerId: user.id,
      },
      data: {
        ...application,
        consentScreen:{
            update: application.consentScreen,
        }
      },
    })
  }

  async findApplication(user, id) {
    return db.app.findUnique({
      where: {
        id,
        ownerId: user.id,
      },
      include: {
        consentScreen: true,
      },
    })
  }

  createSecret() {
    return crypto.randomBytes(64).toString('hex')
  }

  async createClientId() {
    let clientId
    do {
      clientId = 'cid_' + crypto.randomBytes(12).toString('hex')
    } while (await db.app.findUnique({ where: { clientId } }))
    return clientId
  }
}
