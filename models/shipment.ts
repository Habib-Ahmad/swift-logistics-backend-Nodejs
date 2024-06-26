import { Schema, Types, model } from "mongoose";

export interface IShipment {
  name: string;
  startPoint: Types.ObjectId;
  destination: Types.ObjectId;
  schedule: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    timesPerDay?: number;
    dayOfWeek?:
      | ""
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
    dayOfMonth?: number;
  };
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
    schedule: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        required: true,
      },
      interval: { type: Number, required: true },
      timesPerDay: { type: Number },
      dayOfWeek: {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
      dayOfMonth: { type: Number },
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
