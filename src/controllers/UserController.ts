const User = require('../models/User');
const bcrypt = require('bcrypt');
import {Request, Response} from 'express';
const jwt = require('jsonwebtoken');
	
 
async function login(req: Request, res:Response)
{

    let {user, error} = await req.app.locals.database.getUser(req.body.email);

    if(error)
    {
        res.status(500).json({error});
    }
    else if(!user && !user.email)
    {
        let hash = await bcrypt.hash(req.body.password, 5);
	
        let {user, error} = await req.app.locals.database.createUser(req.body.email, hash);

        if(error)
        {
            res.status(401).send('Email exist');
        }
        else
        {
            res.status(200).send({user});
        }
    }
    else
    {
        let pwdCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!pwdCorrect)
        return res.status(400).json({error: "Incorrect password."});
  
        const token = jwt.sign({userId: user._id}, 'secret_key', {expiresIn: "1h"});
        
        res.status(200).json({userId: user._id, token: token});
    } 

}

module.exports = {login: login};