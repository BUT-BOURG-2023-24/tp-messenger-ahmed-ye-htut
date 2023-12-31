const express = require("express");
import { JoiRequestValidatorInstance } from "../JoiRequestValidator";
import conversationController from "../controllers/conversationController";
const router = express.Router();
const auth = require("../auth");

router.post(
  "/:id",
  auth.checkAuth,
  JoiRequestValidatorInstance.validate,
  conversationController.createConversation
);
router.put(
  "/:id",
  auth.checkAuth,
  conversationController.addMessageToConversation
);
router.delete(
  "/:id",
  auth.checkAuth,
  conversationController.deleteConversation
);
router.get(
  "/",
  auth.checkAuth,
  conversationController.getAllConversationsForUser
);
router.get("/:id", auth.checkAuth, conversationController.getConversationById);
router.get(
  "/:id",
  auth.checkAuth,
  conversationController.getConversationWithParticipants
);
router.put(
  "/:id",
  auth.checkAuth,
  conversationController.setConversationSeenForUserAndMessage
);

module.exports = router;
