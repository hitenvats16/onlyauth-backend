import codes from '../../common/constants/codes.js'
import logger from '../../common/utils/logger.js'
import ResourceService from './service.js'

export default class ResourcesController {
  constructor() {
    this.service = new ResourceService()
  }
  async userProfile(req, res) {
    const { userId } = req.tokenData

    const user = await this.service.findUserById(userId)
    const payload = {}
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found', code: codes.USER_NOT_FOUND })
    }
    payload.user = {
      fullName: user.fullName,
      email: user.email,
      picture: user.picture,
      isVerified: user.isVerified,
    }

    const app = await this.service.findAppById(req.tokenData.appId)
    logger.log('Found app', app)
    const token = await this.service.signPayload(payload, app.secret)
    logger.log('Generated token', token)

    return res.json({
      encodedData: token,
    })
  }
}
