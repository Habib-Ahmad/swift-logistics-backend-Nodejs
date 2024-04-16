import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Station } from "../models";

const registerStation = asyncHandler(async (req: Request, res: Response) => {
  const { name, state } = req.body;

  const missingFields: string[] = [];

  if (!name) missingFields.push("name");
  if (!state) missingFields.push("state");

  if (missingFields.length) {
    res.status(400);
    throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
  }

  const isStationRegistered = await Station.findOne({ name });
  if (isStationRegistered) {
    res.status(400);
    throw new Error("Station already registered");
  }

  const station = await Station.create({
    name,
    state,
  });

  if (station) {
    res.status(201).json({ station });
  } else {
    res.status(400);
    throw new Error("Station data is not valid");
  }
});

const getAllStations = asyncHandler(async (req: Request, res: Response) => {
  const stations = await Station.find({}, { __v: 0 });
  res.status(200).json({ stations });
});

const getStationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const station = await Station.findById(id, { __v: 0 });

  if (!station) {
    res.status(404);
    throw new Error("Station not found");
  }

  res.status(200).json({ station });
});

const updateStation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, state } = req.body;

  const station = await Station.findById(id, { __v: 0 });

  if (!station) {
    res.status(404);
    throw new Error("Station not found");
  }

  station.name = name || station.name;
  station.state = state || state.state;

  const updatedStation = await station.save();

  res.status(200).json({ station: updatedStation });
});

const deleteStation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const station = await Station.findById(id);

  if (!station) {
    res.status(404);
    throw new Error("Station not found");
  }

  await station.deleteOne();

  res.status(200).json({ message: "Station deleted successfully" });
});

export {
  registerStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
};
