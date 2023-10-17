import config from "../config";
const mongoose = require('mongoose');
require('dotenv/config');

class Database 
{
	fromTest: boolean;

	constructor(fromTest: boolean) 
	{
		this.fromTest = fromTest;
	}
	
	async connect()
	{
		// config.DB_ADDRESS contient l'adresse de la BDD
		if(this.fromTest == true)
		{
			mongoose.connect(process.env.DB_ADRESS_TEST)

			.then(() => {console.log("Connected to test DB !")})

			.catch((error: Error) => 
				{console.log("Error while connecting to test DB", error)
			});
		}
		else
		{
			mongoose.connect(process.env.DB_ADRESS)

			.then(() => {console.log("Connected to DB !")})

			.catch((error: Error) => 
				{console.log("Error while connecting to DB", error)
			});
		}
	}
}

export default Database;
export type { Database };
