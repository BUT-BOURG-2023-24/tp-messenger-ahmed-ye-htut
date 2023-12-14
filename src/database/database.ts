import config from "../config";
import { MongooseID } from "../types";
import mongoose from "mongoose";
import ConversationModel from "./Mongo/Models/ConversationModel";
import UserModel from "./Mongo/Models/UserModel";
import MessageModel, { IMessage, Reactions } from "./Mongo/Models/MessageModel";
import { pickRandom } from "../pictures";

class Database {
  fromTest: boolean;

  constructor(fromTest: boolean) {
    this.fromTest = fromTest;
  }

  async connect() {
    try {
      const dbAddress = this.fromTest
        ? process.env.DB_ADDRESS_TEST
        : config.DB_ADDRESS;
      await mongoose.connect(dbAddress as string);
      console.log("Connected to DB!");
    } catch (error) {
      console.error("Error while connecting to DB", error);
    }
  }

  async getConversationWithParticipants(id: MongooseID) {
    try {
      const conversationWithParticipants = await ConversationModel.findOne({
        _id: id,
      }).populate({ path: "participants", select: "_id" });
      console.log(conversationWithParticipants);
      return { conversationWithParticipants };
    } catch (error) {
      return { error };
    }
  }

  async getAllConversationsForUser(id: MongooseID) {
    try {
      const allConversationsForUser = await ConversationModel.find({
        participants: id,
      });

      console.log(allConversationsForUser);
      return { allConversationsForUser };
    } catch (error) {
      return { error };
    }
  }

  async getConversationById(id: MongooseID) {
    try {
      const conversationById = await ConversationModel.findById(id);
      console.log(conversationById);

      return { conversationById };
    } catch (error) {
      return { error };
    }
  }

  async createConversation(title: string, participants: MongooseID[]) {
    try {
      let newConversation = new ConversationModel({
        participants,
        title,
      });

      newConversation = await newConversation.save();
      return { newConversation };
    } catch (error) {
      return { error };
    }
  }

  async addMessageToConversation(
    conversationId: MongooseID,
    messageId: MongooseID
  ): Promise<{ success?: boolean; error?: any }> {
    try {
      const conversation = await ConversationModel.findById(conversationId);

      if (!conversation) {
        return { error: "Conversation not found" };
      }

      if (!conversation.messages.includes(messageId)) {
        conversation.messages.push(messageId);
        await conversation.save();
        return { success: true };
      } else {
        return {
          success: false,
          error: "Message already added to conversation",
        };
      }
    } catch (error) {
      return { error };
    }
  }

  async setConversationSeenForUserAndMessage(
    conversationId: MongooseID,
    userId: MongooseID,
    messageId: MongooseID
  ): Promise<{ success?: boolean; error?: any }> {
    try {
      const conversation = await ConversationModel.findById(conversationId);

      if (!conversation) {
        return { error: "Conversation not found" };
      }

      conversation.seen.set(userId, messageId);
      await conversation.save();

      return { success: true };
    } catch (error) {
      return { error };
    }
  }

  async deleteConversation(
    conversationId: MongooseID
  ): Promise<{ success?: boolean; error?: any }> {
    try {
      const result = await ConversationModel.findByIdAndDelete(conversationId);
      if (!result) {
        return { error: "Conversation not found" };
      }

      return { success: true };
    } catch (error) {
      return { error };
    }
  }

  async createUser(username: string, password: string) {
    try {
      let user = new UserModel({
        username,
        password,
        profilePicId: pickRandom(),
      });

      user = await user.save();
      return { user };
    } catch (error) {
      return { error };
    }
  }

  async getUserByName(username: string) {
    try {
      const user = await UserModel.findOne({
        username: username,
      });
      console.log(user);
      return { user };
    } catch (error) {
      return { error };
    }
  }

  async getUserById(id: MongooseID) {
    try {
      const user = await UserModel.findOne({
        _id: id,
      });
      console.log(user);
      return { user };
    } catch (error) {
      return { error };
    }
  }

  async getUsersByIds(ids: MongooseID[]) {
    try {
      const users = await UserModel.find({
        _id: { $in: ids },
      });
      console.log(users);
      return { users };
    } catch (error) {
      return { error };
    }
  }

  async getUsersOnline(ids: MongooseID[]) {
    try {
      const users = await UserModel.find({
        _id: { $in: ids },
      });
      console.log(users);
      return { users };
    } catch (error) {
      return { error };
    }
  }

  async createMessage(
    conversationId: MongooseID,
    from: MongooseID,
    content: string,
    replyTo?: MongooseID | null
  ): Promise<{ newMessage?: IMessage; error?: any }> {
    try {
      const newMessage = await MessageModel.create({
        conversationId,
        from,
        content,
        replyTo,
        postedAt: new Date(),
        edited: false,
        deleted: false,
        reactions: new Map(),
      });

      return { newMessage };
    } catch (error) {
      return { error };
    }
  }

  async editMessage(
    messageId: MongooseID,
    content: string
  ): Promise<{ editedMessage?: IMessage | null; error?: any }> {
    try {
      const editedMessage = await MessageModel.findByIdAndUpdate(
        messageId,
        { content, edited: true },
        { new: true }
      );

      return { editedMessage };
    } catch (error) {
      return { error };
    }
  }

  async deleteMessage(
    messageId: MongooseID
  ): Promise<{ success?: boolean; error?: any }> {
    try {
      await MessageModel.findByIdAndUpdate(messageId, { deleted: true });
      return { success: true };
    } catch (error) {
      return { error };
    }
  }

  async reactToMessage(
    messageId: MongooseID,
    userId: MongooseID,
    reaction: Reactions
  ): Promise<{ updatedMessage?: IMessage | null; error?: any }> {
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        messageId,
        { $set: { [`reactions.${userId}`]: reaction } },
        { new: true }
      );

      return { updatedMessage };
    } catch (error) {
      return { error };
    }
  }

  async getMessageById(
    messageId: MongooseID
  ): Promise<{ message?: IMessage | null; error?: any }> {
    try {
      const message = await MessageModel.findById(messageId);
      return { message };
    } catch (error) {
      return { error };
    }
  }
}

export default Database;
export type { Database };
