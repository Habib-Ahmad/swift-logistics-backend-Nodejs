import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Shipment, ShipmentInstance } from "../models";
import { calculateNextShipmentDate } from "../helpers/calculateNextShipmentDate";

const registerShipment = asyncHandler(async (req: Request, res: Response) => {
  const { name, startPoint, destination, schedule, vehicleId, driverId } =
    req.body;

  const missingFields: string[] = [];

  if (!name) missingFields.push("name");
  if (!startPoint) missingFields.push("startPoint");
  if (!destination) missingFields.push("destination");
  if (!schedule?.frequency) missingFields.push("frequency");
  if (!schedule?.interval) missingFields.push("interval");

  if (missingFields.length) {
    res.status(400);
    throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
  }

  const isShipmentRegistered = await Shipment.findOne({ name });
  if (isShipmentRegistered) {
    res.status(400);
    throw new Error("Shipment already registered");
  }

  try {
    const shipment = await Shipment.create({
      name,
      startPoint,
      destination,
      schedule,
      status: "active",
    });

    if (!shipment) {
      res.status(400);
      throw new Error("Shipment data is not valid");
    }

    // Create shipment instance
    if (schedule.timesPerDay > 1) {
      for (let i = 0; i < schedule.timesPerDay; i++) {
        const date = calculateNextShipmentDate(shipment.schedule);

        await ShipmentInstance.create({
          name: `${shipment.name} ${i + 1}`,
          date: date,
          shipmentId: shipment._id,
          vehicleId,
          driverId,
          items: [],
          status: "pending",
        });
      }
    } else {
      const date = calculateNextShipmentDate(shipment.schedule);

      await ShipmentInstance.create({
        name: shipment.name,
        date: date,
        shipmentId: shipment._id,
        vehicleId,
        driverId,
        items: [],
        status: "pending",
      });
    }

    res.status(201).json({ shipment });
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getAllShipments = asyncHandler(async (req: Request, res: Response) => {
  const shipments = await Shipment.find({}, { __v: 0 })
    .populate("startPoint", "name state")
    .populate("destination", "name state");
  res.status(200).json({ shipments });
});

const getShipmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const shipment = await Shipment.findById(id, { __v: 0 });

  if (!shipment) {
    res.status(404);
    throw new Error("Shipment not found");
  }

  res.status(200).json({ shipment });
});

const updateShipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { startPoint, destination, schedule, status } = req.body;

  const shipment = await Shipment.findById(id, { __v: 0 });

  if (!shipment) {
    res.status(404);
    throw new Error("Shipment not found");
  }

  try {
    shipment.startPoint = startPoint || shipment.startPoint;
    shipment.destination = destination || shipment.destination;
    shipment.status = status || shipment.status;
    shipment.schedule.frequency =
      schedule.frequency || shipment.schedule.frequency;
    shipment.schedule.interval =
      schedule.interval || shipment.schedule.interval;
    shipment.schedule.dayOfWeek =
      schedule.dayOfWeek || shipment.schedule.dayOfWeek;
    shipment.schedule.timesPerDay =
      schedule.timesPerDay || shipment.schedule.timesPerDay;
    shipment.schedule.dayOfMonth =
      schedule.dayOfMonth || shipment.schedule.dayOfMonth;

    const updatedShipment = await shipment.save();

    res.status(200).json({ shipment: updatedShipment });
  } catch (error: any) {
    res.status(400);
    throw new Error(error);
  }
});

const deleteShipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const shipment = await Shipment.findById(id);

  if (!shipment) {
    res.status(404);
    throw new Error("Shipment not found");
  }

  await shipment.deleteOne();

  res.status(200).json({ message: "Shipment deleted successfully" });
});

export {
  registerShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
};
