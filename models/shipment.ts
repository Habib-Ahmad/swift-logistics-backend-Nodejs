import { Schema, Types, model } from "mongoose";
import Station, { IStation } from "./station";

export interface IShipment {
  name: string;
  startPoint: IStation;
  destination: IStation;
  vehicleId: Types.ObjectId;
  driverId: Types.ObjectId;
  items: Types.ObjectId[];
  status: "in progress" | "completed";
}

const shipmentSchema = new Schema<IShipment>(
  {
    name: { type: String, required: true },
    startPoint: { type: Station, required: true },
    destination: { type: Station, required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    status: {
      type: String,
      enum: ["in progress", "completed"],
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
