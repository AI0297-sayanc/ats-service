const randomstring = require("randomstring")
const mailer = require("../../../lib/mail")

const User = require("../../../models/user")
const Org = require("../../../models/organization")

module.exports = {
  /**
  * User signup
  * @api {post} /signup 1. User signup
  * @apiName signup
  * @apiGroup Auth
  * @apiPermission Public
  *
  * @apiParam {String} email User email
  * @apiParam {String} organization Organization Name
  * @apiParam {Object} name User name
  * @apiParam {String} name.first User first name
  * @apiParam {String} [name.last] User last name
  * @apiParam {String} [password] User password (plaintext). If not specified, one will be randomly generated & emailed
  * @apiParam {String} [phone] User phone
  * @apiParam {String} [purpose] Purpose
  * @apiParam {String} [role] User Role
  * @apiParam {String} [website] Website
  * @apiParam {Object} [location] Location
  * @apiParam {String} [location.city] Location City
  * @apiParam {String} [location.country] Location Country
  *
  * @apiSuccessExample {type} Success-Response: 200 OK
  * {
  *     error : false,
  *     user: {}
  * }
  */
  async post(req, res) {
    try {
      const {
        email,
        phone,
        name,
        purpose,
        role,
        website,
        location,
        organization
      } = req.body
      if (email === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field `email`" })
      if (organization === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field `organization`" })
      if (name === undefined || name.first === undefined) return res.status(400).json({ error: true, reason: "Please specify First Name!" })
      const password = (req.body.password !== undefined)
        ? req.body.password
        : randomstring.generate(8) // auto-generated plaintext pass
      const org = await Org.create({ name: organization })
      let user = await User.create({
        email,
        phone,
        password,
        name,
        purpose,
        role,
        website,
        location,
        _organization: org._id
      })
      user = user.toObject()
      delete user.password
      delete user.forgotpassword
      // Send welcome email, but NO WAITING!
      mailer("welcome", {
        to: email,
        subject: "Welcome!!!",
        locals: { email, password, name }
      })
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
