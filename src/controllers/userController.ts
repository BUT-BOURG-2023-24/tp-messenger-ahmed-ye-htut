import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const { user, error } = await req.app.locals.database.createUser(
        username,
        password
      );

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(user);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { user, error } = await req.app.locals.database.getUserById(userId);

      if (error) {
        res.status(500).json({ error }).send();
      } else if (!user) {
        res.status(404).json({ error: "User not found" }).send();
      } else {
        res.status(200).send(user);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async getUserByName(req: Request, res: Response) {
    try {
      const username = req.params.username;
      const { user, error } = await req.app.locals.database.getUserByName(
        username
      );

      if (error) {
        res.status(500).json({ error }).send();
      } else if (!user) {
        res.status(404).json({ error: "User not found" }).send();
      } else {
        res.status(200).send(user);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async getUsersByIds(req: Request, res: Response) {
    try {
      const userIds = req.body.userIds;
      const { users, error } = await req.app.locals.database.getUsersByIds(
        userIds
      );

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(users);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const { users, error } = await req.app.locals.database.getAllUsers();

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(users);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async getUsersOnline(req: Request, res: Response) {
    try {
      const userIds = req.body.userIds;
      const { users, error } = await req.app.locals.database.getUsersByIds(
        userIds
      );

      if (error) {
        res.status(500).json({ error }).send();
      } else {
        res.status(200).send(users);
      }
    } catch (error) {
      res.status(500).json({ error }).send();
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Check if the user already exists
      const existingUser = await req.app.locals.database.getUserByName(
        username
      );

      if (existingUser.user) {
        const { user, error } = existingUser;

        const pwdCorrect = await bcrypt.compare(password, user.password);

        if (!pwdCorrect) {
          return res.status(400).json({ error: "Incorrect password." });
        }

        const token = jwt.sign({ userId: user._id }, "secret_key", {
          expiresIn: "1h",
        });

        return res.status(200).json({ user, token });
      } else {
        const hash = await bcrypt.hash(password, 5);
        const { user, error } = await req.app.locals.database.createUser(
          username,
          hash
        );

        if (error) {
          return res.status(401).json({ error: "Username exists" });
        } else {
          const token = jwt.sign({ userId: user!._id }, "secret_key", {
            expiresIn: "1h",
          });

          return res.status(200).json({ user, token });
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  //   async login2(req: Request, res: Response) {

  //     let { user } = await req.app.locals.database.getUserByName(req.body.username);

  //     if (user && user.username) {
  //         let pwdCorrect = await bcrypt.compare(req.body.password, user.password);
  //         if (!pwdCorrect)
  //             return res.status(400).json({ error: "Incorrect password." });

  //         const token = jwt.sign({ userId: user._id }, "secret_key", {
  //             expiresIn: "1h",
  //         });

  //         res.status(200).json({ userId: user._id, token: token });
  //     }
  //     else if (!user || !user.username) {

  //         let hash = await bcrypt.hash(req.body.password, 5);

  //         let { user, error } = await req.app.locals.database.createUser(
  //             req.body.username,
  //             hash,
  //         );

  //         if (error) {
  //             res.status(401).send("error creation in db");
  //         } else {
  //             res.status(200).send({ user });
  //         }
  //     }
  // }
}

const userController = new UserController();
export default userController;
