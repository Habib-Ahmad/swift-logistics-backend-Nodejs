import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Order } from "../models";

const registerOrder = asyncHandler(async (req: Request, res: Response) => {
  const { sender, recipient, shipmentId } = req.body;
  const {
    firstName: senderFirstName,
    lastName: senderLastName,
    phone: senderPhone,
  } = sender;
  const {
    firstName: recipientFirstName,
    lastName: recipientLastName,
    phone: recipientPhone,
    address: recipientAddress,
  } = recipient;

  const missingFields: string[] = [];

  if (!sender) missingFields.push("sender");
  if (!senderFirstName) missingFields.push("sender firstName");
  if (!senderLastName) missingFields.push("sender lastName");
  if (!senderPhone) missingFields.push("sender phone");

  if (!recipient) missingFields.push("recipient");
  if (!recipientFirstName) missingFields.push("recipient firstName");
  if (!recipientLastName) missingFields.push("recipient lastName");
  if (!recipientPhone) missingFields.push("recipient phone");
  if (!recipientAddress) missingFields.push("recipient address");

  if (!shipmentId) missingFields.push("shipmentId");

  if (missingFields.length) {
    res.status(400);
    throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
  }

  const isOrderRegistered = await Order.findOne({ name });
  if (isOrderRegistered) {
    res.status(400);
    throw new Error("Order already registered");
  }

  const order = await Order.create({
    sender: {
      firstName: senderFirstName,
      lastName: senderLastName,
      phone: senderPhone,
    },
    recipient: {
      firstName: recipientFirstName,
      lastName: recipientLastName,
      phone: recipientPhone,
      address: recipientAddress,
    },
    shipmentHistory: [shipmentId],
    status: "pending",
  });

  if (order) {
    res.status(201).json({ order });
  } else {
    res.status(400);
    throw new Error("Order data is not valid");
  }
});

const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({}, { __v: 0 });
  res.status(200).json({ orders });
});

const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id, { __v: 0 });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({ order });
});

const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { sender, recipient, shipmentId } = req.body;
  const {
    firstName: senderFirstName,
    lastName: senderLastName,
    phone: senderPhone,
  } = sender;
  const {
    firstName: recipientFirstName,
    lastName: recipientLastName,
    phone: recipientPhone,
    address: recipientAddress,
  } = recipient;

  const order = await Order.findById(id, { __v: 0 });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.sender = {
    firstName: senderFirstName || order.sender.firstName,
    lastName: senderLastName || order.sender.lastName,
    phone: senderPhone || order.sender.phone,
  };
  order.recipient = {
    firstName: recipientFirstName || order.recipient.firstName,
    lastName: recipientLastName || order.recipient.lastName,
    phone: recipientPhone || order.recipient.phone,
    address: recipientAddress || order.recipient.address,
  };

  order.shipmentHistory =
    [...order.shipmentHistory, shipmentId] || order.shipmentHistory;

  const updatedOrder = await order.save();

  res.status(200).json({ order: updatedOrder });
});

const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await order.deleteOne();

  res.status(200).json({ message: "Order deleted successfully" });
});

export { registerOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };
