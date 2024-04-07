import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Driver } from "../models";

const registerDriver = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, dob, phone, address } = req.body;

  const missingFields: string[] = [];

  if (!firstName) missingFields.push("firstName");
  if (!lastName) missingFields.push("lastName");
  if (!email) missingFields.push("email");
  if (!dob) missingFields.push("dob");
  if (!phone) missingFields.push("phone");
  if (!address) missingFields.push("address");

  if (missingFields.length) {
    res.status(400);
    throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
  }

  const isDriverRegistered = await Driver.findOne({ email });
  if (isDriverRegistered) {
    res.status(400);
    throw new Error("Driver already registered");
  }

  const driver = await Driver.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    address,
    status: "idle",
  });

  if (driver) {
    res.status(201).json({ driver });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

const updateDriver = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, dob, phone, address, status } = req.body;

  const driver = await Driver.findById(id);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  driver.firstName = firstName || driver.firstName;
  driver.lastName = lastName || driver.lastName;
  driver.email = email || driver.email;
  driver.dob = dob || driver.dob;
  driver.phone = phone || driver.phone;
  driver.address = address || driver.address;
  driver.status = status || driver.status;

  const updatedDriver = await driver.save();

  res.status(200).json({ driver: updatedDriver });
});

const getAllDrivers = asyncHandler(async (req: Request, res: Response) => {
  const drivers = await Driver.find({});
  res.status(200).json({ drivers });
});

const getDriverById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const driver = await Driver.findById(id);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  res.status(200).json({ driver });
});

const deleteDriver = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const driver = await Driver.findById(id);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  await driver.deleteOne();

  res.status(200).json({ message: "Driver deleted successfully" });
});

export {
  registerDriver,
  updateDriver,
  getAllDrivers,
  getDriverById,
  deleteDriver,
};
