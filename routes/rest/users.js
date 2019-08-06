const randomstring = require("randomstring")
const mailer = require("../../lib/mail")

const User = require("../../models/user.js")

module.exports = {

  /**
   * Fetch all the Users
   * @api {get} /users 1.0 Fetch all the Users
   * @apiName fetchUsers
   * @apiGroup User
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     users: [{}]
   * }
   */
  async find(req, res) {
    try {
      const users = await User.find({ _organization: req.user._organization }).populate("_organization").select("-password -forgotpassword").exec()
      return res.json({ error: false, users })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a User by _id
   * @api {get} /user/:id 2.0 Find a User by _id
   * @apiName getUser
   * @apiGroup User
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the User to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     user: {}
   * }
   */
  async get(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id, _organization: req.user._organization }).populate("_organization").select("-password -forgotpassword").exec()
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new User
   * @api {post} /user 3.0 Create a new User
   * @apiName createUser
   * @apiGroup User
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} email User email
   * @apiParam  {Object} name User name
   * @apiParam  {String} name.first User name.first
   * @apiParam  {String} [password] User password (plaintext). If not specified, one will be randomly generated & emailed
   * @apiParam  {String} [phone] User phone
   * @apiParam  {Boolean} [isActive=true] User isActive
   * @apiParam  {String} [name.last] User name.last
   * @apiParam  {String} [purpose] User purpose
   * @apiParam  {String} [role] User role
   * @apiParam  {String} [website] User website
   * @apiParam  {Object} [location] User location
   * @apiParam  {String} [location.city] User location.city
   * @apiParam  {String} [location.country] User location.country
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
        email, phone, isActive, name, purpose, role, website, location
      } = req.body
      if (email === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'email'" })
      // if (password === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'password'" })
      if (name === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'name'" })
      if (name.first === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'name.first'" })

      const password = (req.body.password !== undefined)
        ? req.body.password
        : randomstring.generate(8) // auto-generated plaintext pass

      let user = await User.create({
        email, phone, password, isActive, name, purpose, role, website, location, _createdBy: req.user._id, _organization: req.user._organization
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
  },

  /**
   * Edit a User by _id
   * @api {put} /user/:id 4.0 Edit a User by _id
   * @apiName editUser
   * @apiGroup User
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the User to edit

   * @apiParam  {String} [phone] User phone
   * @apiParam  {Boolean} [isActive=true] User isActive
   * @apiParam  {String} [name.last] User name.last
   * @apiParam  {String} [purpose] User purpose
   * @apiParam  {String} [role] User role
   * @apiParam  {String} [website] User website
   * @apiParam  {Object} [location] User location
   * @apiParam  {String} [location.city] User location.city
   * @apiParam  {String} [location.country] User location.country
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     user: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        phone, password, isActive, name, purpose, role, website, location
      } = req.body
      let user = await User.findOne({ _id: req.params.id, _organization: req.user._organization }).exec()
      if (user === null) return res.status(400).json({ error: true, reason: "No such User in you Organization!" })

      if (phone !== undefined) user.phone = phone
      if (password !== undefined) user.password = password
      if (isActive !== undefined) user.isActive = isActive
      if (name !== undefined && name.first !== undefined) user.name.first = name.first
      if (name !== undefined && name.last !== undefined) user.name.last = name.last
      if (purpose !== undefined) user.purpose = purpose
      if (role !== undefined) user.role = role
      if (website !== undefined) user.website = website
      if (location !== undefined && location.city !== undefined) user.location.city = location.city
      if (location !== undefined && location.country !== undefined) user.location.country = location.country
      user.lastModifiedAt = Date.now()

      user = await user.save()
      user = user.toObject()
      delete user.password
      delete user.forgotpassword
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a User by _id
   * @api {delete} /user/:id 5.0 Delete a User by _id
   * @apiName deleteUser
   * @apiGroup User
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the User to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      const cnt = await User.count({ _id: req.params.id, _organization: req.user._organization }).exec()
      if (cnt === 0) throw new Error("No such user in your Organization!")
      await User.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
