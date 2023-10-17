import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

export interface IConversation extends Document {
	participants :MongooseID[],
	messages : MongooseID[],
	title : string,
	lastUpdate : Date,
	seen : Map<MongooseID,MongooseID>
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
	participants :
	{
		type : Schema.Types.ObjectId,
		ref : 'User',
		required : true,
	},
	messages:
	{
		type : Schema.Types.ObjectId,
		ref : 'Message',
	},
	title :
	{
		type: String, 
		required: true, 
	},
	lastUpdate:
	{
		type: Date,
		default: Date.now,
	},
	seen:
	{
		type: Map,
		of: String,
		default: {}
	}
});

const ConversationModel = mongoose.model<IConversation>("Conversation", conversationSchema);

export default ConversationModel; 