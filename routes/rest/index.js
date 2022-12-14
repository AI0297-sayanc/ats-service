const express = require("express")
const router = express.Router()

const expressJwt = require("express-jwt")
const multer = require("multer")

// const config = require("../../config")[process.env.NODE_ENV || "development"]

const checkJwt = expressJwt({ secret: process.env.SECRET }) // the JWT auth check middleware
const upload = multer({ dest: "/tmp/", limits: { fileSize: 5000000 } }) // max file size 5 MB

const login = require("./auth")
const signup = require("./auth/signup")
const forgotpassword = require("./auth/password")
const users = require("./users")
const openings = require("./openings")
const workflowStages = require("./workflowStages")
const tags = require("./tags")
const widgets = require("./widgets")
const messages = require("./messages")
const dataImports = require("./data-import")
const dataExports = require("./data-export")
const candidates = require("./candidates")
const events = require("./candidates/events")
const notes = require("./candidates/notes")
const stages = require("./candidates/stages")
const profile = require("./profile")


router.post("/login", login.post) // UNAUTHENTICATED
router.post("/signup", signup.post) // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow) // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword) // UNAUTHENTICATED; AJAX
router.get("/tags/:type", tags.find) // UNAUTHENTICATED
router.get("/widget/openings/:apikey", widgets.get) // UNAUTHENTICATED
router.post("/applyforjob/:openingid", widgets.applyForJob) // UNAUTHENTICATED
router.post("/webhook/message/replyreceived", messages.replyReceived) // UNAUTHENTICATED; Mailgun Routes Handler
router.post("/webhook/message/delivered", messages.delivered) // UNAUTHENTICATED; Mailgun Webhook Handler
router.post("/webhook/message/opened", messages.opened) // UNAUTHENTICATED; Mailgun Webhook Handler

router.get("/downloadcv/:id/:token", candidates.downloadCV) // UNAUTHENTICATED, but verify auth inside route def using jwt given as param

router.get("/export/openings/:token", dataExports.openings) // UNAUTHENTICATED, but verify auth inside route def using jwt given as param
router.get("/export/candiates/:openingid/:token", dataExports.candidates) // UNAUTHENTICATED, but verify auth inside route def using jwt given as param

router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.post("/support", require("./support").supportQuery)

router.get("/users", users.find)
router.get("/user/:id", users.get)
router.post("/user", users.post)
router.put("/user/:id", users.put)
router.delete("/user/:id", users.delete)

router.get("/openings", openings.find)
router.get("/opening/:id", openings.get)
router.post("/opening", openings.post)
router.put("/opening/:id", openings.put)
router.delete("/opening/:id", openings.delete)

router.get("/workflowStages", workflowStages.find)
router.get("/workflowStage/:id", workflowStages.get)
router.post("/workflowStage", workflowStages.post)
router.put("/workflowStage/:id", workflowStages.put)
router.delete("/workflowStage/:id", workflowStages.delete)

router.put("/widget/organization/apikey", widgets.put)
router.get("/widget/organization/apikey", widgets.getApiKey)
router.get("/widget/organization/code", widgets.getWidgetCode)

router.post("/message/send", messages.post)
router.post("/messages", messages.get)

router.post("/import/openings", upload.single("csv-file"), dataImports.openings)
router.post("/import/candidates", upload.single("csv-file"), dataImports.candidates)

router.post("/candidates", candidates.find)
router.get("/candidate/:id", candidates.get)
router.post("/candidate", candidates.post)
router.put("/candidate/:id", candidates.put)
router.delete("/candidate/:id", candidates.delete)

router.get("/notes/:candidateid", notes.find)
router.get("/note/:id", notes.get)
router.post("/note", notes.post)
router.put("/note/:id", notes.put)
router.delete("/note/:id", notes.delete)

router.get("/events/:candidateid", events.find)
router.get("/event/:id", events.get)
router.post("/event", events.post)

router.put("/candidate/nextstage/:id", stages.nextStage)
router.put("/candidate/movetostage/:id", stages.moveToStage)
router.put("/candidate/decision/:id", stages.changeDecisionStatus)

router.get("/me", profile.get)
router.put("/me", profile.put)

module.exports = router
