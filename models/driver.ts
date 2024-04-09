import { model, Schema } from "mongoose";

export interface IDriver {
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  phone: string;
  address: string;
  status: "idle" | "in transit" | "inactive" | "terminated";
}

const driverSchema = new Schema<IDriver>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

driverSchema.set("toJSON", {
  virtuals: true,
});

const Driver = model<IDriver>("Driver", driverSchema);

export default Driver;
