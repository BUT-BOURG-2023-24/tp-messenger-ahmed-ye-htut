import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

export interface IUser extends Document {
	username : string,
	password : string,
	profilePicId : MongooseID
}

const userSchema: Schema<IUser> = new Schema<IUser>({
	username: 
	{ 
		type: String, 
		required: true, 
		unique: true 
	},
	password: 
	{ 
		type: String, 
		required: true 
	},
	profilePicId :
	{
		type : Schema.Types.ObjectId,
		required : true
	}
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
