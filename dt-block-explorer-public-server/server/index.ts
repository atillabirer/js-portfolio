import express from "express";
import { api } from "./routes";
import cors from "cors";
import bodyParser from "body-parser";
import { db_url } from "./config";
import { graphListener } from "./lib";
import mongoose from "mongoose";
import { CronJob } from "cron";
export async function main() {
  mongoose.connect(db_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection.on("connection", () => {
    console.log("connected to db");
  });
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/api", api);
  app.get("/", (req, res) => {
    res.send("Hello");
  });
  cron();
  app.listen(process.env.PORT || 4000, () => {
    console.log("listening");
  });
}

const cron = () => {
  console.log("cron running");
  new CronJob(
    "59 59 22 * * *",
    graphListener,
    undefined,
    true,
    "Etc/UTC",
    undefined,
    false
  );
};

main();
