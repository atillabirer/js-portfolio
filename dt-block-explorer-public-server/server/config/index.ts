require("dotenv").config();
export const api = process.env.API_URL || "http://54.84.189.173:8545";
export const db_url = process.env.MONGO_URL || "mongodb://localhost:27017/prod";
