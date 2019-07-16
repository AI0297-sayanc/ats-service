const express = require("express")
const router = express.Router()

const expressJwt = require("express-jwt")
const multer = require("multer")

const config = require("../../config")[process.env.NODE_ENV || "development"]

const checkJwt = expressJwt({ secret: config.secret }) // the JWT auth check middleware
const upload = multer({ dest: "/tmp/", limits: { fileSize: 5000000 } }) // max file size 5 MB

const login = require("./auth")
const signup = require("./auth/signup")
const forgotpassword = require("./auth/password")
const users = require("./users")
const openings = require("./openings")
const events = require("./events")
const workflowStages = require("./workflowStages")
const tags = require("./tags")
const widgets = require("./widgets")
const messages = require("./messages")
const dataImports = require("./data-import")
const dataExports = require("./data-export")
const candidates = require("./candidates")
const stages = require("./candidates/stages")


router.post("/login", login.post) // UNAUTHENTICATED
router.post("/signup", signup.post) // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow) // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword) // UNAUTHENTICATED; AJAX
router.post("/tags/:type", tags.find) // UNAUTHENTICATED
router.get("/widget/openings/:apikey", widgets.get) // UNAUTHENTICATED
// router.post("/widget/apply", widgets.post) // UNAUTHENTICATED
router.post("/webhook/message/replyreceived", messages.replyReceived) // UNAUTHENTICATED; Mailgun Webhook Handler
router.post("/webhook/message/opened", messages.opened) // UNAUTHENTICATED; Mailgun Webhook Handler

router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

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

router.get("/events", events.find)
router.get("/event/:id", events.get)
router.post("/event", events.post)
router.put("/event/:id", events.put)
router.delete("/event/:id", events.delete)

router.get("/workflowStages", workflowStages.find)
router.get("/workflowStage/:id", workflowStages.get)
router.post("/workflowStage", workflowStages.post)
router.put("/workflowStage/:id", workflowStages.put)
router.delete("/workflowStage/:id", workflowStages.delete)

router.put("/widget/organization/apikey", widgets.put)
router.get("/widget/organization/apikey", widgets.getApiKey)
router.get("/widget/organization/code", widgets.getWidgetCode)

router.post("/message/send", messages.post)
router.get("/messages", messages.get)

router.post("/import/openings", upload.single("csv-file"), dataImports.openings)
router.post("/import/candidates", upload.single("csv-file"), dataImports.candidates)

router.get("/export/openings", dataExports.openings)
router.get("/export/candiates", dataExports.candidates)

router.get("/candidates", candidates.find)
router.get("/candidate/:id", candidates.get)
router.post("/candidate", candidates.post)
router.put("/candidate/:id", candidates.put)
router.delete("/candidate/:id", candidates.delete)

router.put("/candidate/nextstage/:id", stages.nextStage)
router.put("/candidate/movetostage/:id", stages.moveToStage)

module.exports = router
