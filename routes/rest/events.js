
const Event = require("../../models/event.js")

module.exports = {

  /**
   * Fetch all the Events
   * @api {get} /events 1.0 Fetch all the Events
   * @apiName fetchEvents
   * @apiGroup Event
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     events: [{}]
   * }
   */
  async find(req, res) {
    try {
      const events = await Event.find({}).exec()
      return res.json({ error: false, events })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a Event by _id
   * @api {get} /event/:id 2.0 Find a Event by _id
   * @apiName getEvent
   * @apiGroup Event
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Event to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     event: {}
   * }
   */
  async get(req, res) {
    try {
      const event = await Event.findOne({ _id: req.params.id }).exec()
      return res.json({ error: false, event })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new Event
   * @api {post} /event 3.0 Create a new Event
   * @apiName createEvent
   * @apiGroup Event
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} title Event title
   * @apiParam  {String} description Event description
   * @apiParam  {String} [location] Event location
   * @apiParam  {Date} [start] Event start
   * @apiParam  {Date} [end] Event end
   * @apiParam  {String} [url] Event url
   * @apiParam  {Object} [geo] Event geo
   * @apiParam  {Number} [geo.lat] Event geo.lat
   * @apiParam  {Number} [geo.lon] Event geo.lon
   * @apiParam  {String[]} [categories] Event categories
   * @apiParam  {String} [status] Event status
   * @apiParam  {Object} [organizer] Event organizer
   * @apiParam  {String} [organizer.name] Event organizer.name
   * @apiParam  {String} [organizer.email] Event organizer.email
   * @apiParam  {undefined[]} [attendees] Event attendees
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     event: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        title, description, location, start, end, url, geo, categories, status, organizer, attendees
      } = req.body
      if (title === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'title'" })
      if (description === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'description'" })
      const event = await Event.create({
        title, description, location, start, end, url, geo, categories, status, organizer, attendees
      })
      return res.json({ error: false, event })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a Event by _id
   * @api {put} /event/:id 4.0 Edit a Event by _id
   * @apiName editEvent
   * @apiGroup Event
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Event to edit

   * @apiParam  {String} [location] Event location
   * @apiParam  {Date} [start] Event start
   * @apiParam  {Date} [end] Event end
   * @apiParam  {String} [url] Event url
   * @apiParam  {Object} [geo] Event geo
   * @apiParam  {Number} [geo.lat] Event geo.lat
   * @apiParam  {Number} [geo.lon] Event geo.lon
   * @apiParam  {String[]} [categories] Event categories
   * @apiParam  {String} [status] Event status
   * @apiParam  {Object} [organizer] Event organizer
   * @apiParam  {String} [organizer.name] Event organizer.name
   * @apiParam  {String} [organizer.email] Event organizer.email
   * @apiParam  {undefined[]} [attendees] Event attendees
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     event: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        title, description, location, start, end, url, geo, categories, status, organizer, attendees
      } = req.body
      const event = await Event.findOne({ _id: req.params.id }).exec()
      if (event === null) return res.status(400).json({ error: true, reason: "No such Event!" })

      if (title !== undefined) event.title = title
      if (description !== undefined) event.description = description
      if (location !== undefined) event.location = location
      if (start !== undefined) event.start = start
      if (end !== undefined) event.end = end
      if (url !== undefined) event.url = url
      if (geo !== undefined && geo.lat !== undefined) event.geo.lat = geo.lat
      if (geo !== undefined && geo.lon !== undefined) event.geo.lon = geo.lon
      if (categories !== undefined) event.categories = categories
      if (status !== undefined) event.status = status
      if (organizer !== undefined && organizer.name !== undefined) event.organizer.name = organizer.name
      if (organizer !== undefined && organizer.email !== undefined) event.organizer.email = organizer.email
      if (attendees !== undefined) event.attendees = attendees

      await event.save()
      return res.json({ error: false, event })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a Event by _id
   * @api {delete} /event/:id 4.0 Delete a Event by _id
   * @apiName deleteEvent
   * @apiGroup Event
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Event to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await Event.deleteOne({ _id: req.params.id }).exec()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
