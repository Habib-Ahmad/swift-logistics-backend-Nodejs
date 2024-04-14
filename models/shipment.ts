import { Schema, Types, model } from "mongoose";

export interface IShipment {
  name: string;
  startPoint: Types.ObjectId;
  destination: Types.ObjectId;
  status: "active" | "inactive";
}

const shipmentSchema = new Schema<IShipment>(
  {
    name: { type: String, required: true },
    startPoint: { type: Schema.Types.ObjectId, ref: "Station", required: true },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
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
