import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

export enum Reactions {
	HAPPY = "HAPPY",
	SAD = "SAD",
	THUMBSUP = "THUMBSUP",
	THUMBSDOWN = "THUMBSDOWN",
	LOVE = "LOVE",
}

export interface IMessage extends Document {
	conversationId: MongooseID;
	from: MongooseID;
	content: string;
	postedAt: Date;
	replyTo?: string | null;
	edited: boolean;
	deleted: boolean;
	reactions: Map<MongooseID, Reactions>;
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
	conversationId:
	{
		type: Schema.Types.ObjectId,
		ref: "Conversation",
		//required: true
	},
	from:
	{
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	content:
	{
		type: String,
		required: true
	},
	postedAt:
	{
		type: Date,
		default: Date.now,
		required: true
	},
	replyTo:
	{
		type: Schema.Types.ObjectId,
		ref: "Message",
		default: null
	},
	edited:
	{
		type: Boolean,
		default: false
	},
	deleted:
	{
		type: Boolean,
		default: false
	},
	reactions:
	{
		type: Map,
		of: String,
		default: {}
	},
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
