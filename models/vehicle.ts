import { model, Schema } from "mongoose";

export interface IVehicle {
  brand: string;
  carModel: string;
  year: string;
  color: string;
  registrationNumber: string;
  type: "saloon" | "bus" | "bike";
  transmission?: "automatic" | "manual";
  status: "idle" | "in transit" | "inactive" | "decomissioned";
}

const vehicleSchema = new Schema<IVehicle>(
  {
    brand: { type: String, required: true },
    carModel: { type: String, required: true },
    year: { type: String, required: true },
    color: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    type: { type: String, required: true },
    transmission: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

vehicleSchema.set("toJSON", {
  virtuals: true,
});

const Vehicle = model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;
