import { Request, Response } from "express";

const jwt = require('jsonwebtoken');
	
 
	
function checkAuth(req : Request, res : Response, next : Function)
{
	const token = req.headers.authorization;
	if(!token)
	{
		return res.status(401).json({error:'Need a token!'});
	}
	
    try
    {
        const decodedToken = jwt.verify(token, 'secret_key');
        const userId = decodedToken.userId;
        //res.userId = userId; // On stocke l'User Id si la requête veut l'utiliser
        res.append('userid',userId);
        next();
    }
    catch(error)
    {
        return res.status(401).send({error: "Token expired !"});
    }
}

module.exports = {checkAuth: checkAuth};
	
 
	
module.exports = {checkAuth: checkAuth};