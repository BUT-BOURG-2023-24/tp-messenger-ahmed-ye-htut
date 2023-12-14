import type { Server, Socket } from "socket.io";
import type { Database } from "../database/database";
import type { MongooseID } from "../types";
import { IConversation } from "../database/Mongo/Models/ConversationModel";

export class SocketController {
  private socketIdToUserIdMap: Map<string, string> = new Map();

  constructor(private io: Server, private Database: Database) {
    this.connect();
    this.listenRoomChanged();
  }

  connect(): void {
    this.io.on("connection", async (socket: Socket) => {
      try {
        const userId: string | string[] | undefined = socket.handshake.headers.userId;

        if (!userId) {
          throw new Error("User ID not provided in headers");
        }

        this.socketIdToUserIdMap.set(socket.id, userId as string);

        const result = await this.Database.getAllConversationsForUser(userId as MongooseID);

        if (result.error) {
          throw result.error;
        }

        const userConversations: IConversation[] | undefined = result.allConversationsForUser;

        if (userConversations) {
          userConversations.forEach((conversation: IConversation) => {
            const roomName: string = conversation._id.toString();

            try {
              socket.join(roomName);
            } catch (joinError) {
              console.error(`Error joining room ${roomName}:`, joinError);
            }
          });
        } else {
          console.warn("No conversations found for the user");
        }
      } catch (error) {
        console.error("Error during socket connection:", error);
      }
    });


    this.io.on("disconnect", (socket: Socket) => {
      const userId = this.socketIdToUserIdMap.get(socket.id);
      if (userId) {
        this.socketIdToUserIdMap.delete(socket.id);
        console.log(`User with ID ${userId} disconnected.`);
      }
    });
  }

  listenRoomChanged() {
    this.io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });

    this.io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });

    this.io.of("/").adapter.on("leave-room", (room, id) => {
      console.log(`socket ${id} has leave room ${room}`);
    });

    this.io.of("/").adapter.on("delete-room", (room) => {
      console.log(`room ${room} was deleted`);
    });
  }
}



 /*
	connect()
	{
		this.io.on("connection", (socket) => {
			// Récupérer les infos voulu depuis les extra headers.
			// socket.handshake.headers contient ce que vous voulez. 

			/*
				Dès qu'un socket utilisateur arrive, on veut l'ajouter à la room
				pour chaque conversation dans laquelle il se trouve. 

				ETAPE 1: 
					Trouver toutes les conversations ou participe l'utilisateur. 

				ETAPE 2:
					Rejoindre chaque room ayant pour nom l'ID de la conversation. 

				HINT:
					socket.join(roomName: string) permet de rejoindre une room.
					Le paramètre roomName doit absolument être de type string,
					si vous mettez un type number, cela ne fonctionnera pas.
		
		});
		*/