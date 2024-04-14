import { Schema, model } from "mongoose";
import Station, { IStation } from "./station";

export interface IShipment {
  name: string;
  startPoint: IStation;
  destination: IStation;
  status: "active" | "inactive";
}

const shipmentSchema = new Schema<IShipment>(
  {
    name: { type: String, required: true },
    startPoint: { type: Station, required: true },
    destination: { type: Station, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
  },
  { timestamps: true }
);

shipmentSchema.set("toJSON", {
  virtuals: true,
});

const Shipment = model<IShipment>("Shipment", shipmentSchema);

export default Shipment;
