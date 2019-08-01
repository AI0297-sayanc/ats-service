const User = require("../../models/user")
const Org = require("../../models/organization")


const mail = require("../../lib/mail")

module.exports = {
  /**
  * Fetch my profile
  * @api {get} /me 1.0 Fetch my profile
  * @apiName getMyProfile
  * @apiGroup MyProfile
  * @apiPermission User
  *
  * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
  */
  async get(req, res) {
    try {
      const user = await User
        .findOne({ _id: req.user._id })
        .select("-password -forgotpassword")
        .populate("_organization")
        .exec()
      return res.json({
        error: false,
        user
      })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit my profile details
   * @api {put} /me 2.0 Edit my profile details
   * @apiName profileEdit
   * @apiGroup MyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} [phone] My phone
   * @apiParam  {Boolean} [isActive=true] My isActive status
   * @apiParam  {Object} [name] My name
   * @apiParam  {String} [name.first] My name.first
   * @apiParam  {String} [name.last] My name.last
   * @apiParam  {String} [purpose] My purpose
   * @apiParam  {String} [role] My role
   * @apiParam  {String} [website] My website
   * @apiParam  {Object} [location] My location
   * @apiParam  {String} [location.city] My location.city
   * @apiParam  {String} [location.country] My location.country
   * @apiParam  {Object} [organization] My organization details
   * @apiParam  {String} [organization.name] My organization name
   * @apiParam  {String} [organization.address] My organization address
   * @apiParam  {String} [organization.logoUrl] My organization logoUrl
   */
  async put(req, res) {
    try {
      const {
        phone, password, isActive, name, purpose, role, website, location, organization
      } = req.body
      const [user, org] = await Promise.all([
        User.findOne({ _id: req.user.id }).exec(),
        Org.findOne({ _id: req.user._organization }).exec()
      ])

      const promises = []

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
      promises.push(user.save())

      if (organization !== undefined) {
        if (organization.name !== undefined) org.name = organization.name
        if (organization.logoUrl !== undefined) org.logoUrl = organization.logoUrl
        if (organization.address !== undefined) org.address = organization.address
        organization.lastModifiedAt = user.lastModifiedAt
        promises.push(org.save())
      }

      await Promise.all(promises)

      return res.status(200).json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

}
