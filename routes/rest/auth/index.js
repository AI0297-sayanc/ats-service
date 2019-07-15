const jwt = require("jsonwebtoken")

const User = require("../../../models/user")

module.exports = {
  /**
  * @api {POST} /login 2. Authenticate an user and get a JWT on success
  * @apiName Login
  * @apiGroup Auth
  * @apiVersion  1.0.0
  * @apiPermission Public
  *
  * @apiParam  {String} handle User email/mobile to login with
  * @apiParam  {String} password User password (plaintext)
  * @apiParam  {String} [expiry=720] Life of the JWT in hours
  *
  * @apiSuccessExample {JSON} Success-Response: 200 OK
  *    {
        error: false,
        isAdmin: false,
        handle: 'foo@bar.com',
        token: 'XXX.YYYYY.ZZZZZZZ'
      }
  */
  async post(req, res) {
    try {
      // const { type } = req.params
      const { handle, password, expiry } = req.body
      if (handle === undefined || password === undefined) {
        return res.status(400).json({ error: true, reason: "Fields `handle` and `password` are mandatory" })
      }
      const user = await User.findOne({
        $or: [{ email: handle.toLowerCase() }, { phone: handle }]
      }).exec()
      if (user === null) throw new Error("User Not Found")
      if (user.isActive === false) throw new Error("User Inactive")
      // check pass
      await user.comparePassword(password)
      // No error, send jwt
      const payload = {
        id: user._id,
        _id: user._id,
        fullName: user.name.full,
        email: user.email,
        phone: user.phone,
        _organization: user._organization,
        organization: user._organization,
      }
      const expiresInHours = (expiry === undefined || expiry === null || Number(expiry) === 0)
        ? 24 * 30 // 1 month (default)
        : expiry
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * expiresInHours
      })
      return res.json({ error: false, handle, token })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
