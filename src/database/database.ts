import config from "../config";
import {MongooseID} from "../types";
const mongoose = require('mongoose');
require('dotenv/config');
const conversation = require(".../ConversationModel");
const message = require(".../MessageModel")

class Database {
	fromTest: boolean;

	constructor(fromTest: boolean) {
		this.fromTest = fromTest;
	}

	async connect() {
		// config.DB_ADDRESS contient l'adresse de la BDD
		if (this.fromTest == true) {
			await mongoose.connect(process.env.DB_ADDRESS_TEST)

				.then(() => { console.log("Connected to test DB !") })

				.catch((error: Error) => {
					console.log("Error while connecting to test DB", error)
				});
		}
		else {
			await mongoose.connect(config.DB_ADDRESS )
				.then(() => { console.log("Connected to DB!"); })
				.catch((error: Error) => {
					console.error("Error while connecting to DB", error);
				});
		}
	}

	async getConversationWithParticipants(id: MongooseID) {
		try {
			const conversationWithParticipants = await conversation.findOne({ _id: id })
				.populate({path : 'participants', select : '_id'});
			console.log(conversationWithParticipants);
			conversationWithParticipants.populated("participants")
			return { conversationWithParticipants };
		} catch (error) {
			return { error };
		}
	}

	async getAllConversationsForUser(id : MongooseID){
		try {
			const allConversationsForUser = await conversation.findOne({ _id: id })
				.populate({path : 'conversations', select : '_id'});
			console.log(allConversationsForUser);
			allConversationsForUser.populated("conversations._id")
			return { allConversationsForUser };
		} catch (error) {
			return { error };
		}
	}

	async getConversationById(id : MongooseID){
		try {
			const conversationById = await conversation.findById(id)
			console.log(conversationById);

			return { conversationById };
		} catch (error) {
			return { error };
		}
	}

	async createConversation(title : string, participants : MongooseID[]){
		try {
			let newConversation = new conversation
			({
				participants,
				title
			});

			newConversation = await newConversation.save();
			return { newConversation };
		}
		catch (error) {
			return { error }
		}
	}

	async addMessageToConversation(conversationId : MongooseID, messageId : MongooseID){
		try {
			const conversationToaddMessage = this.getConversationById(conversationId)

			if(!conversationToaddMessage){
				return { error }
			}
			newMessage = await newMessage.save();
			return { newMessage };
		}
		catch (error) {
			return { error }
		}
	}

	async setConversationSeenForUserAndMessage(){

	}


	async deleteConversation(){

	}
}

export default Database;
export type { Database };


