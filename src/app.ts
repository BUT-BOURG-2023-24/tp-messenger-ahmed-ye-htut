import * as http from "http";
import express from "express";
import { Server } from "socket.io";
import { Database } from "./database/database";
import { SocketController } from "./socket/socketController";
import userRoutes from './routes/usersRoutes';
import cors from "cors";
const app = express();

function makeApp(database: Database) {
  app.locals.database = database;

  app.locals.database.connect();

  const server = http.createServer(app);
  app.use(express.json());

  const io = new Server(server, { cors: { origin: "*" } });
  let socketController = new SocketController(io, database);
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  app.locals.socketController = socketController;

  app.use("/users", userRoutes);

  return { app, server };
}

export { makeApp };

