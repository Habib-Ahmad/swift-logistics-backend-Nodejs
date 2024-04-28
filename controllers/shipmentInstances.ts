import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ShipmentInstance } from "../models";

const registerShipmentInstance = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, date, vehicleId, driverId, shipmentId, items } = req.body;

    const missingFields: string[] = [];

    if (!name) missingFields.push("name");
    if (!date) missingFields.push("date");
    if (!vehicleId) missingFields.push("vehicleId");
    if (!driverId) missingFields.push("driverId");
    if (!shipmentId) missingFields.push("shipmentId");
    if (!items) missingFields.push("items");

    if (missingFields.length) {
      res.status(400);
      throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
    }

    const isShipmentInstanceRegistered = await ShipmentInstance.findOne({
      name,
    });
    if (isShipmentInstanceRegistered) {
      res.status(400);
      throw new Error("ShipmentInstance already registered");
    }

    const shipment = await ShipmentInstance.create({
      name,
      vehicleId,
      driverId,
      shipmentId,
      items,
      status: "pending",
    });

    if (shipment) {
      res.status(201).json({ shipment });
    } else {
      res.status(400);
      throw new Error("ShipmentInstance data is not valid");
    }
  }
);

const getAllShipmentInstances = asyncHandler(
  async (req: Request, res: Response) => {
    const shipments = await ShipmentInstance.find({}, { __v: 0 });
    res.status(200).json({ shipments });
  }
);

const getShipmentInstanceById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const shipment = await ShipmentInstance.findById(id, { __v: 0 });

    if (!shipment) {
      res.status(404);
      throw new Error("ShipmentInstance not found");
    }

    res.status(200).json({ shipment });
  }
);

const updateShipmentInstance = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, date, vehicleId, driverId, shipmentId, items, status } =
      req.body;

    const shipment = await ShipmentInstance.findById(id, { __v: 0 });

    if (!shipment) {
      res.status(404);
      throw new Error("ShipmentInstance not found");
    }

    const newItems = items.length ? items : [];
    const oldItems = shipment.items;

    try {
      shipment.name = name || shipment.name;
      shipment.date = date || shipment.date;
      shipment.vehicleId = vehicleId || shipment.vehicleId;
      shipment.driverId = driverId || shipment.driverId;
      shipment.shipmentId = shipmentId || shipment.shipmentId;
      shipment.items = oldItems.length
        ? [...oldItems, ...newItems]
        : shipment.items;
      shipment.status = status || shipment.status;

      const updatedShipmentInstance = await shipment.save();

      res.status(200).json({ shipment: updatedShipmentInstance });
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
);

const deleteShipmentInstance = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const shipment = await ShipmentInstance.findById(id);

    if (!shipment) {
      res.status(404);
      throw new Error("ShipmentInstance not found");
    }

    await shipment.deleteOne();

    res.status(200).json({ message: "ShipmentInstance deleted successfully" });
  }
);

export {
  registerShipmentInstance,
  getAllShipmentInstances,
  getShipmentInstanceById,
  updateShipmentInstance,
  deleteShipmentInstance,
};
