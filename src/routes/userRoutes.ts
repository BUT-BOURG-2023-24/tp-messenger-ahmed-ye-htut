const express = require("express");
import userController from "../controllers/userController";
const router = express.Router();
const auth = require("../auth");

router.post("/login", userController.login);
router.post("/all", userController.getAllUsers);
router.get("/:id", auth.checkAuth, userController.getUserById);
router.get("/", auth.checkAuth, userController.getUserByName);
router.get("/:id", auth.checkAuth, userController.getUsersByIds);
router.get("/online", auth.checkAuth, userController.getUsersOnline);

module.exports = router;
