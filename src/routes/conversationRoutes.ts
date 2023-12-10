const express = require('express')
import conversationController from "../controllers/conversationController"
const router = express.Router()
const auth= require("../auth")

router.post('/',auth.checkAuth, conversationController.createConversation)
router.post('/:id',auth.checkAuth, conversationController.addMessageToConversation )
router.delete('/:id',auth.checkAuth, conversationController.deleteConversation)
router.get('/',auth.checkAuth, conversationController.getAllConversationsForUser )
router.get('/:id',auth.checkAuth, conversationController.getConversationById )
router.get('/:id',auth.checkAuth, conversationController.getConversationWithParticipants )
router.post('/:id',auth.checkAuth, conversationController.setConversationSeenForUserAndMessage )


module.exports = router