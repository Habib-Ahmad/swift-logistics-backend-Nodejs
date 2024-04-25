import { Schema, Types, model } from "mongoose";

export interface IOrder {
  sender: {
    name: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  transactionId: string;
  weight: number; // In kg
  description: string;
  shipmentHistory: Types.ObjectId[];
  deliveryHistory: Types.ObjectId[];
  status: "pending" | "in transit" | "delivered";
}

const orderSchema = new Schema<IOrder>(
  {
    sender: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    recipient: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    transactionId: { type: String, required: true },
    weight: { type: Number, required: true },
    description: { type: String, required: true },
    shipmentHistory: [{ type: Schema.Types.ObjectId, ref: "Shipment" }],
    deliveryHistory: [{ type: Schema.Types.ObjectId, ref: "Delivery" }],
    status: {
      type: String,
      enum: ["pending", "in transit", "delivered"],
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.set("toJSON", {
  virtuals: true,
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
