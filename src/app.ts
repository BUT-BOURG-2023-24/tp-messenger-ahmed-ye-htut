import * as http from "http";
import express from "express";
import { Server } from "socket.io";
import { Database } from "./database/database";
import { SocketController } from "./socket/socketController";
const conversationRoutes = require('./routes/conversationRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();

function makeApp(database: Database) {
  app.locals.database = database;

  app.locals.database.connect();

  const server = http.createServer(app);
  app.use(express.json());

  const io = new Server(server, { cors: { origin: "*" } });
  let socketController = new SocketController(io, database);

  app.locals.sockerController = socketController;
  app.use('/conversations', conversationRoutes)
	app.use('/users',userRoutes)

  return { app, server };
}

export { makeApp };
