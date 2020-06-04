import { Document, model, Schema } from "mongoose";

interface IGraph extends Document {
  close: number;
  supply: number;
  timeStamp: Date;
}

const GraphSchema = new Schema({
  close: Number,
  supply: Number,
  timeStamp: Date
});

export const Graph = model<IGraph>("Graph", GraphSchema);
