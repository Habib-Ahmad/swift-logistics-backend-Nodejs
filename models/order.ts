import { Schema, Types, model } from "mongoose";

export interface IOrder {
  sender: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  recipient: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  };
  shipmentHistory: Types.ObjectId[];
  deliveryHistory: Types.ObjectId[];
  status: "pending" | "in transit" | "delivered";
}

const orderSchema = new Schema<IOrder>(
  {
    sender: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
    },
    recipient: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    shipmentHistory: [{ type: Schema.Types.ObjectId, ref: "Shipment" }],
    deliveryHistory: [{ type: Schema.Types.ObjectId, ref: "Delivery" }],
    status: { type: String, required: true },
  },
  { timestamps: true }
);

orderSchema.set("toJSON", {
  virtuals: true,
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
