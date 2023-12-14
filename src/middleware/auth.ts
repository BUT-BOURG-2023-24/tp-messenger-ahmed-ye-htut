import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

async function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization as string;

  if (!token) {
    return res.status(401).json({ error: "Need a token!" });
  }

  try {
    const decodedToken: any = jwt.verify(token, "secret_key");
    const userId = decodedToken.userId;

    res.locals.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token expired!" });
  }
}

export { checkAuth };
