const moment = require("moment")

const Event = require("../../../models/event")
const Candidate = require("../../../models/candidate")

module.exports = {
  /**
   * Fetch all the Events
   * @api {get} /events/:candidateid 1.0 Fetch all the Events for a Candidate
   * @apiName fetchEvents
   * @apiGroup CandidateEvent
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   * @apiParam  {String} candidateid `URL Param` _id of the Candidate
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     events: [{}]
   * }
   */
  async find(req, res) {
    const { candidateid } = req.params
    try {
      const events = await Event.find({ _candidate: candidateid, _organization: req.user._organization }).exec()
      return res.json({ error: false, events })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a Event by _id
   * @api {get} /event/:id 2.0 Find a Event by _id
   * @apiName getEvent
   * @apiGroup CandidateEvent
   * @apiPermission User
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
      const event = await Event.findOne({ _id: req.params.id, _organization: req.user._organization }).exec()
      if (event === null) throw new Error("No such event for you!")
      return res.json({ error: false, event })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new Event
   * @api {post} /event 3.0 Create a new Event for a Candidate at its current workflow stage
   * @apiName createEvent
   * @apiGroup CandidateEvent
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} candidateId _id of Candidate
   * @apiParam  {String} title Event title
   * @apiParam  {String} description Event description
   * @apiParam  {Date} start Event start
   * @apiParam  {Date} end Event end
   * @apiParam  {String} [location] Event location
   * @apiParam  {String} [url] Event url
   * @apiParam  {Object} [geo] Event geo
   * @apiParam  {Number} [geo.lat] Event geo.lat
   * @apiParam  {Number} [geo.lon] Event geo.lon
   * @apiParam  {String[]} [categories] Event categories
   * @apiParam  {String} [status="CONFIRMED"] Event status
   * @apiParam  {Object[]} [extraAttendees[]] Array of Event attendees besides the candidate itself
   * @apiParam  {String} [extraAttendees.name] Name of an extra attendee
   * @apiParam  {String} [extraAttendees.email] Email of an extra attendee
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
        candidateId, title, description, location, start, end, url, geo, categories, status, extraAttendees
      } = req.body
      if (candidateId === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'candidateId'" })
      const candidate = await Candidate.findOne({ _id: candidateId, _organization: req.user._organization }).exec()
      if (candidate === null) throw new Error("No such candidate for you!")

      if (title === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'title'" })
      if (description === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'description'" })
      if (start === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'start'" })
      if (!moment(start).isValid()) return res.status(400).json({ error: true, reason: "Invalid date in field 'start'" })
      if (end === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'end'" })
      if (!moment(end).isValid()) return res.status(400).json({ error: true, reason: "Invalid date in field 'end'" })

      const organizer = {
        name: req.user.fullName,
        email: req.user.email
      }
      const attendees = [{
        name: candidate.name.full,
        email: candidate.email
      }]
      if (Array.isArray(extraAttendees)) {
        attendees.push(...extraAttendees)
      }

      candidate.activities.push({ text: "Interview scheduled for Candidate", _workflowStage: candidate._currentWorkflowStage, when: Date.now() })

      const [event, __c] = await Promise.all([
        Event.create({
          title, description, location, start, end, url, geo, categories, status, organizer, attendees, _candidate: candidateId, _organization: req.user._organization, _createdBy: req.user._user, _workflowStage: candidate._currentWorkflowStage
        }),
        candidate.save()
      ])
      return res.json({ error: false, event })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

}
