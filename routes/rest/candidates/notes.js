const Candidate = require("../../../models/candidate")
const Note = require("../../../models/note.js")

module.exports = {

  /**
   * Fetch all the Notes for a Candidate
   * @api {get} /notes/:candidateid 1.0 Fetch all the Notes for a Candidate
   * @apiName fetchNotes
   * @apiGroup CandidateNote
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   * @apiParam  {String} candidateid `URL Param` _id of the Candidate
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     notes: [{}]
   * }
   */
  async find(req, res) {
    const { candidateid } = req.params
    try {
      const notes = await Note.find({ _candidate: candidateid, _organization: req.user._organization }).populate("_createdBy", "name email phone").exec()
      return res.json({ error: false, notes })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a Note by _id
   * @api {get} /note/:id 2.0 Find a Note by its _id
   * @apiName getNote
   * @apiGroup CandidateNote
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Note to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     note: {}
   * }
   */
  async get(req, res) {
    try {
      const note = await Note.findOne({ _id: req.params.id, _organization: req.user._organization }).populate("_createdBy", "name email phone").exec()
      if (note === null) throw new Error("No such note for you!")
      return res.json({ error: false, note })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new Note
   * @api {post} /note 3.0 Create a new Note
   * @apiName createNote
   * @apiGroup CandidateNote
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} text Note text
   * @apiParam  {String} candidateId _id of the Candidate
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     note: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        text, candidateId
      } = req.body
      if (text === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'text'" })
      if (candidateId === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'candidateId'" })

      const candidate = await Candidate.findOne({ _id: candidateId, _organization: req.user._organization }).select("_id _currentWorkflowStage activities").exec()
      if (candidate === null) throw new Error("You don't have any such candidate!")

      candidate.activities.push({ text: `${req.user.fullName} created a Note`, _workflowStage: candidate._currentWorkflowStage, when: Date.now() })

      const [note, __c] = await Promise.all([
        Note.create({
          text, _createdBy: req.user._id, _organization: req.user._organization, _candidate: candidateId
        }),
        candidate.save()
      ])
      await note.populate("_createdBy").execPopulate()
      return res.json({ error: false, note })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a Note by _id
   * @api {put} /note/:id 4.0 Edit a Note by _id
   * @apiName editNote
   * @apiGroup CandidateNote
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Note to edit
   * @apiParam  {String} text Note text
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     note: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        text
      } = req.body
      const note = await Note.findOne({ _id: req.params.id, _createdBy: req.user._id }).exec()
      if (note === null) return res.status(400).json({ error: true, reason: "No such Note for you!" })

      if (text !== undefined) note.text = text
      note.lastModifiedAt = Date.now()

      await note.save()
      return res.json({ error: false, note })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a Note by _id
   * @api {delete} /note/:id 5.0 Delete a Note by _id
   * @apiName deleteNote
   * @apiGroup CandidateNote
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Note to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      const cnt = await Note.count({ _id: req.params.id, _createdBy: req.user._id }).exec()
      if (cnt === 0) throw new Error("Not your note to delete!")
      await Note.deleteOne({ _id: req.params.id }).exec()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
