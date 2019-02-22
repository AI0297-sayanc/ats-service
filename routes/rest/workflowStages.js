
const WorkflowStage = require("../../models/workflow-stage.js")

module.exports = {

  /**
   * Fetch all the WorkflowStages
   * @api {get} /workflowStages 1.0 Fetch all the WorkflowStages
   * @apiName fetchWorkflowStages
   * @apiGroup WorkflowStage
   * @apiPermission Public
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
      const workflowStages = await WorkflowStage.find({}).exec()
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
   * @apiPermission Public
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
      const workflowStage = await WorkflowStage.findOne({ _id: req.params.id }).exec()
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
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} text WorkflowStage text
   * @apiParam  {String} [type] WorkflowStage type `enum=["screening", "remote", "onsite"]`
   * @apiParam  {Number} [sortOrder] WorkflowStage sortOrder
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
        text, type, sortOrder
      } = req.body
      if (text === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'text'" })
      const workflowStage = await WorkflowStage.create({
        text, type, sortOrder
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
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the WorkflowStage to edit

   * @apiParam  {String} [type] WorkflowStage type `enum=["screening", "remote", "onsite"]`
   * @apiParam  {Number} [sortOrder] WorkflowStage sortOrder
   * @apiParam  {Date} [createdAt] WorkflowStage createdAt
   * @apiParam  {Date} [lastModifiedAt] WorkflowStage lastModifiedAt
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
        text, type, sortOrder
      } = req.body
      const workflowStage = await WorkflowStage.findOne({ _id: req.params.id }).exec()
      if (workflowStage === null) return res.status(400).json({ error: true, reason: "No such WorkflowStage!" })

      if (text !== undefined) workflowStage.text = text
      if (type !== undefined) workflowStage.type = type
      if (sortOrder !== undefined) workflowStage.sortOrder = sortOrder

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
   * @apiPermission Public
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
      await WorkflowStage.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
