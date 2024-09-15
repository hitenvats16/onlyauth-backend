import codes from "../../common/constants/codes.js"
import ResourceService from "./service.js"

export default class ResourcesController {
    constructor(){
        this.service = new ResourceService()
    }
  async userProfile(req, res) {
    const { userId } = req.tokenData

    const user = await this.service.findUserById(userId)

    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found', code: codes.USER_NOT_FOUND })
    }

    return res.json({ user:{
        fullName: user.fullName,
        email: user.email,
        picture: user.picture,
        isVerified: user.isVerified,
    } })
  }
}
