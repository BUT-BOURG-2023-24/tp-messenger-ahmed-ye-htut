const express = require("express");
const userController = require('../controllers/UserController');
const auth = require("../auth")

const userRoutes = express.userRoutes();

userRoutes.post('/login' ,userController.login);

export default userRoutes;