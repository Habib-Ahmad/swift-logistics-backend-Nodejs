import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Vehicle } from "../models";

const registerVehicle = asyncHandler(async (req: Request, res: Response) => {
  const {
    brand,
    carModel,
    year,
    color,
    registrationNumber,
    type,
    transmission,
  } = req.body;

  const missingFields: string[] = [];

  if (!brand) missingFields.push("brand");
  if (!carModel) missingFields.push("carModel");
  if (!year) missingFields.push("year");
  if (!color) missingFields.push("color");
  if (!registrationNumber) missingFields.push("registrationNumber");
  if (!type) missingFields.push("type");

  if (missingFields.length) {
    res.status(400);
    throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
  }

  const isVehicleRegistered = await Vehicle.findOne({ registrationNumber });
  if (isVehicleRegistered) {
    res.status(400);
    throw new Error("User already registered");
  }

  const vehicle = await Vehicle.create({
    brand,
    carModel,
    year,
    color,
    registrationNumber,
    type,
    transmission,
    status: "idle",
  });

  if (vehicle) {
    res.status(201).json({ vehicle });
  } else {
    res.status(400);
    throw new Error("Vehicle data is not valid");
  }
});

const getAllVehicles = asyncHandler(async (req: Request, res: Response) => {
  const vehicles = await Vehicle.find({});
  res.status(200).json({ vehicles });
});

const getVehicleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  res.status(200).json({ vehicle });
});

const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    brand,
    carModel,
    year,
    color,
    registrationNumber,
    type,
    transmission,
    status,
  } = req.body;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  vehicle.brand = brand || vehicle.brand;
  vehicle.carModel = carModel || vehicle.carModel;
  vehicle.year = year || vehicle.year;
  vehicle.color = color || vehicle.color;
  vehicle.registrationNumber = registrationNumber || vehicle.registrationNumber;
  vehicle.type = type || vehicle.type;
  vehicle.transmission = transmission || vehicle.transmission;
  vehicle.status = status || vehicle.status;

  const updatedVehicle = await vehicle.save();

  res.status(200).json({ vehicle: updatedVehicle });
});

const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  await vehicle.deleteOne();

  res.status(200).json({ message: "Vehicle deleted successfully" });
});

export {
  registerVehicle,
  getAllVehicles,
  updateVehicle,
  getVehicleById,
  deleteVehicle,
};
