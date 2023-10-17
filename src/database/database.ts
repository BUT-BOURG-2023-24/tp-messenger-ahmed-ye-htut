import config from "../config";
const mongoose = require('mongoose');
require('dotenv/config');

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
			await mongoose.connect(config.DB_ADDRESS as string)
				.then(() => { console.log("Connected to DB!"); })
				.catch((error: Error) => {
					console.error("Error while connecting to DB", error);
				});
		}
	}
}

export default Database;
export type { Database };


