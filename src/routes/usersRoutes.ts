const express = require("express");
const userController = require('../controllers/UserController');
const auth = require("../auth")

const router = express.Router();

router.post('/login', auth.checkAuth ,userController.login);

module.exports = router;