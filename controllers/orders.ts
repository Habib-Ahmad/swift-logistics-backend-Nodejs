import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Order } from "../models";

const registerOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      sender,
      recipient,
      shipmentId,
      weight,
      description,
      transactionId,
    } = req.body;
    const { name: senderName, phone: senderPhone } = sender;
    const {
      name: recipientName,
      phone: recipientPhone,
      address: recipientAddress,
    } = recipient;

    const missingFields: string[] = [];

    if (!sender) missingFields.push("sender");
    if (!senderName) missingFields.push("sender name");
    if (!senderPhone) missingFields.push("sender phone");

    if (!recipient) missingFields.push("recipient");
    if (!recipientName) missingFields.push("recipient name");
    if (!recipientPhone) missingFields.push("recipient phone");
    if (!recipientAddress) missingFields.push("recipient address");

    if (!shipmentId) missingFields.push("shipmentId");
    if (!transactionId) missingFields.push("transactionId");
    if (!weight) missingFields.push("weight");
    if (!description) missingFields.push("description");

    if (missingFields.length) {
      res.status(400);
      throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
    }

    try {
      const order = await Order.create({
        sender: {
          name: senderName,
          phone: senderPhone,
        },
        recipient: {
          name: recipientName,
          phone: recipientPhone,
          address: recipientAddress,
        },
        shipmentHistory: [shipmentId],
        transactionId,
        weight,
        description,
        status: "pending",
      });

      if (!order) {
        res.status(400);
        throw new Error("Order data is not valid");
      }

      res.status(201).json({ order });
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);

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
  const { name: senderName, phone: senderPhone } = sender;
  const {
    name: recipientName,
    phone: recipientPhone,
    address: recipientAddress,
  } = recipient;

  const order = await Order.findById(id, { __v: 0 });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.sender = {
    name: senderName || order.sender.name,
    phone: senderPhone || order.sender.phone,
  };
  order.recipient = {
    name: recipientName || order.recipient.name,
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
