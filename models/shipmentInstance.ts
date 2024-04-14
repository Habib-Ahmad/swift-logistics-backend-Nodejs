import { Schema, Types, model } from "mongoose";

export interface IShipmentInstance {
  name: string;
  date: Date;
  shipmentId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  driverId: Types.ObjectId;
  items: Types.ObjectId[];
  status: "pending" | "in progress" | "completed";
}

const InstanceSchema = new Schema<IShipmentInstance>(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    shipmentId: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      required: true,
    },
  },
  { timestamps: true }
);

InstanceSchema.set("toJSON", {
  virtuals: true,
});

const ShipmentInstance = model<IShipmentInstance>(
  "ShipmentInstance",
  InstanceSchema
);

export default ShipmentInstance;
