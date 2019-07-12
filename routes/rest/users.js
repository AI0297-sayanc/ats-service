
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
      const users = await User.find({}).exec()
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
      const user = await User.findOne({ _id: req.params.id }).exec()
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
   * @apiParam  {Date} [createdAt] User createdAt
   * @apiParam  {Date} [lastModifiedAt] User lastModifiedAt
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
        createdAt, lastModifiedAt
      } = req.body
      const user = await User.create({
        createdAt, lastModifiedAt
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

   * @apiParam  {Date} [createdAt] User createdAt
   * @apiParam  {Date} [lastModifiedAt] User lastModifiedAt
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
        createdAt, lastModifiedAt
      } = req.body
      const user = await User.findOne({ _id: req.params.id }).exec()
      if (user === null) return res.status(400).json({ error: true, reason: "No such User!" })

      if (createdAt !== undefined) user.createdAt = createdAt
      if (lastModifiedAt !== undefined) user.lastModifiedAt = lastModifiedAt

      await user.save()
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a User by _id
   * @api {delete} /user/:id 4.0 Delete a User by _id
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
      await User.deleteOne({ _id: req.params.id }).exec()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
