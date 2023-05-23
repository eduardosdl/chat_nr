import Parse from "parse";
import dotenv from "dotenv";

dotenv.config();

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY);
Parse.serverURL = process.env.SERVER_URL;

export default Parse;
