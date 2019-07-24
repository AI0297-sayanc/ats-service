const Candidate = require("../../../models/candidate")
// const Opening = require("../../../models/opening")

module.exports = {
  /**
   * Move a Candidate to next workflow stage
   * @api {put} /candidate/nextstage/:id 6.1. Move a Candidate to next workflow stage
   * @apiName nextWorkflowStage
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Candidate
   *
   */
  async nextStage(req, res) {
    try {
      const candidate = await Candidate
        .findOne({ _id: req.params.id, _organization: req.user._organization })
        .populate("_opening")
        .exec()
      if (candidate === null) return res.status(400).json({ error: true, reason: "You don't have any such candidate!" })

      const currentStageIdx = candidate._opening._workflowStages.map(String).indexOf(String(candidate._currentWorkflowStage))
      const nextStage = candidate._opening._workflowStages[currentStageIdx + 1]
      if (nextStage === undefined) throw new Error("There is no next stage!")
      candidate._currentWorkflowStage = nextStage
      candidate.lastModifiedAt = Date.now()

      candidate.activities.push({ text: "Entered workflow stage", _workflowStage: candidate._currentWorkflowStage, when: candidate.lastModifiedAt })

      await candidate.save()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Move a Candidate to given workflow stage
   * @api {put} /candidate/movetostage/:id 6.2. Move a Candidate to given workflow stage
   * @apiName moveToWorkflowStage
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Candidate
   * @apiParam {String} stageId Workflow stage _id to move to
   *
   */
  async moveToStage(req, res) {
    const { stageId } = req.body
    if (stageId === undefined) return res.status(400).json({ error: true, reason: "Missing mandatroy field 'stageId'" })
    try {
      const candidate = await Candidate
        .findOne({ _id: req.params.id, _organization: req.user._organization })
        .populate("_opening")
        .exec()
      if (candidate === null) return res.status(400).json({ error: true, reason: "You don't have any such candidate!" })

      if (!candidate._opening._workflowStages.map(String).includes(stageId)) throw new Error("Invalid Stage Id!")

      candidate._currentWorkflowStage = stageId
      candidate.lastModifiedAt = Date.now()

      candidate.activities.push({ text: "Entered workflow stage", _workflowStage: candidate._currentWorkflowStage, when: candidate.lastModifiedAt })

      await candidate.save()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Set Decision Status for a Candidate
   * @api {put} /candidate/decision/:id 6.3. Set Decision Status for a Candidate
   * @apiName decisionStatus
   * @apiGroup Candidate
   * @apiPermission User
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Candidate
   * @apiParam {String} decisionStatus The decision status to be set `enum["pending", "rejected", "accepted", "on-hold"]`
   * @apiParam {String} [rejectionReason] Rejection reason [MANDATORY if decision == "rejected"]
   *
   */
  async changeDecisionStatus(req, res) {
    const { decisionStatus, rejectionReason } = req.body
    if (!["pending", "rejected", "accepted", "on-hold"].includes(decisionStatus)) return res.status(400).json({ error: true, reason: "Field 'decisionStatus' is mandatory & must be one of 'pending', 'rejected', 'accepted', 'on-hold'" })
    if (decisionStatus === "rejected" && rejectionReason === undefined) return res.status(400).json({ error: true, reason: "Field 'rejectionReason' is mandatory if 'decisionStatus' is 'rejected'" })
    try {
      const candidate = await Candidate
        .findOne({ _id: req.params.id, _organization: req.user._organization })
        .exec()
      if (candidate === null) return res.status(400).json({ error: true, reason: "You don't have any such candidate!" })

      candidate.decisionStatus = decisionStatus
      candidate.lastModifiedAt = Date.now()
      if (decisionStatus === "rejected") {
        candidate.rejectionReason = rejectionReason
        candidate.rejectedAt = candidate.lastModifiedAt
      }

      candidate.activities.push({ text: `Candidate's status changed to ${decisionStatus}`, _workflowStage: candidate._currentWorkflowStage, when: candidate.lastModifiedAt })

      await candidate.save()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
}
