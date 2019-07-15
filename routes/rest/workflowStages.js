
const WorkflowStage = require("../../models/workflow-stage.js")

module.exports = {

  /**
   * Fetch all the WorkflowStages
   * @api {get} /workflowStages 1.0 Fetch all the WorkflowStages
   * @apiName fetchWorkflowStages
   * @apiGroup WorkflowStage
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     workflowStages: [{}]
   * }
   */
  async find(req, res) {
    try {
      const workflowStages = await WorkflowStage.find({ _organization: req.user._organization }).exec()
      return res.json({ error: false, workflowStages })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a WorkflowStage by _id
   * @api {get} /workflowStage/:id 2.0 Find a WorkflowStage by _id
   * @apiName getWorkflowStage
   * @apiGroup WorkflowStage
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the WorkflowStage to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     workflowStage: {}
   * }
   */
  async get(req, res) {
    try {
      const workflowStage = await WorkflowStage.findOne({ _id: req.params.id, _organization: req.user._organization }).exec()
      if (workflowStage === null) throw new Error("No such workflowstage for you!")
      return res.json({ error: false, workflowStage })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new WorkflowStage
   * @api {post} /workflowStage 3.0 Create a new WorkflowStage
   * @apiName createWorkflowStage
   * @apiGroup WorkflowStage
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} text WorkflowStage text
   * @apiParam  {String} [type] WorkflowStage type `enum=["screening", "remote", "onsite"]`
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     workflowStage: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        text, type
      } = req.body
      if (text === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'text'" })
      const workflowStage = await WorkflowStage.create({
        text, type, _organization: req.user._organization
      })
      return res.json({ error: false, workflowStage })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a WorkflowStage by _id
   * @api {put} /workflowStage/:id 4.0 Edit a WorkflowStage by _id
   * @apiName editWorkflowStage
   * @apiGroup WorkflowStage
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the WorkflowStage to edit

   * @apiParam  {String} [text] WorkflowStage text
   * @apiParam  {String} [type] WorkflowStage type `enum=["screening", "remote", "onsite"]`
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     workflowStage: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        text, type
      } = req.body
      const workflowStage = await WorkflowStage.findOne({ _id: req.params.id, _organization: req.user._organization }).exec()
      if (workflowStage === null) return res.status(400).json({ error: true, reason: "No such WorkflowStage for you!" })

      if (text !== undefined) workflowStage.text = text
      if (type !== undefined) workflowStage.type = type

      await workflowStage.save()
      return res.json({ error: false, workflowStage })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a WorkflowStage by _id
   * @api {delete} /workflowStage/:id 4.0 Delete a WorkflowStage by _id
   * @apiName deleteWorkflowStage
   * @apiGroup WorkflowStage
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the WorkflowStage to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await WorkflowStage.deleteOne({ _id: req.params.id, _organization: req.user._organization }).exec()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
