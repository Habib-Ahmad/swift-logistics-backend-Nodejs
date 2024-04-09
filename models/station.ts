import { Schema, model } from "mongoose";

export interface IStation {
  state: string;
  name: string;
}

const stationSchema = new Schema<IStation>(
  {
    state: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

stationSchema.set("toJSON", {
  virtuals: true,
});

const Station = model<IStation>("Station", stationSchema);

export default Station;
