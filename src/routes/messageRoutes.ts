const express = require("express");
import messageController from "../controllers/messageController";
const router = express.Router();
const auth = require("../auth");

router.post("/", auth.checkAuth, messageController.createMessage);
router.put("/:id", auth.checkAuth, messageController.editMessage);
router.get("/", auth.checkAuth, messageController.getMessageById);
router.delete("/:id", auth.checkAuth, messageController.deleteMessage);
router.post("/:id", auth.checkAuth, messageController.reactToMessage);

module.exports = router;
