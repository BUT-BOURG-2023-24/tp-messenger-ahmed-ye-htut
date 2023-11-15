const User = require("../database/Mongo/Models/UserModel");
const bcrypt = require("bcrypt");
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
import {pickRandom} from "../pictures";

async function login(req: Request, res: Response) {

    let { user } = await req.app.locals.database.getUser(req.body.username);

    if (user && user.username) {
        let pwdCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!pwdCorrect)
            return res.status(400).json({ error: "Incorrect password." });

        const token = jwt.sign({ userId: user._id }, "secret_key", {
            expiresIn: "1h",
        });

        res.status(200).json({ userId: user._id, token: token });
    }
    else if (!user || !user.username) {

        let hash = await bcrypt.hash(req.body.password, 5);

        let { user, error } = await req.app.locals.database.createUser(
            req.body.username,
            hash,
            pickRandom()
        );

        if (error) {
            res.status(401).send("error creation in db");
        } else {
            res.status(200).send({ user });
        }
    }
}

async function home(req: Request, res: Response){
    let { users, error } = await req.app.locals.database.getAllUsers();

    if(error)
    {
        return res.status(500).json({error});
    }
    else
    {
        res.status(200).send({users});
    }
}

module.exports = { login: login, home };




