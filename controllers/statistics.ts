import { Request, Response } from "express";
import { Driver, Order, Shipment, ShipmentInstance, Vehicle } from "../models";

const getAllStats = async (req: Request, res: Response) => {
  try {
    // drivers
    const totalDrivers = await Driver.countDocuments();
    const activeDrivers = await Driver.countDocuments({
      status: { $in: ["idle", "in transit"] },
    });

    // vehicles
    const totalVehicles = await Vehicle.countDocuments();
    const totalVans = await Vehicle.countDocuments({ type: "bus" });
    const totalCars = await Vehicle.countDocuments({ type: "saloon" });
    const totalBikes = await Vehicle.countDocuments({ type: "bike" });

    // orders
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const ordersOverTime = await Order.aggregate([
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
      {
        $project: {
          _id: 0,
          week: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  isoWeekYear: "$_id.year",
                  isoWeek: "$_id.week",
                },
              },
            },
          },
          count: 1,
        },
      },
    ]);
    const totalPriceOfOrders = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    // shipments
    const totalshipments = await Shipment.countDocuments();
    const pendingShipments = await ShipmentInstance.countDocuments({
      status: "pending",
    });
    const completedShipments = await ShipmentInstance.countDocuments({
      status: "completed",
    });
    const cancelledShipments = await ShipmentInstance.countDocuments({
      status: "cancelled",
    });
    const inProgressShipments = await ShipmentInstance.countDocuments({
      status: "in progress",
    });
    const topShipments = await ShipmentInstance.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
    ]);
    const popularDestinations = await Shipment.aggregate([
      {
        $lookup: {
          from: "stations",
          localField: "destination",
          foreignField: "_id",
          as: "destinationDetails",
        },
      },
      {
        $unwind: "$destinationDetails",
      },
      {
        $group: {
          _id: "$destinationDetails._id", // Group by destination ID
          name: { $first: "$destinationDetails.name" }, // Get the first name encountered
          count: { $sum: 1 }, // Count the number of shipments for each destination
        },
      },
      {
        $sort: {
          count: -1, // Sort by count in descending order
        },
      },
      {
        $limit: 5, // Limit to the top 5 most popular destinations
      },
    ]);

    res.status(200).json({
      drivers: { totalDrivers, activeDrivers },
      vehicles: { totalVehicles, totalVans, totalCars, totalBikes },
      shipments: {
        totalshipments,
        pending: pendingShipments,
        completed: completedShipments,
        cancelled: cancelledShipments,
        inProgress: inProgressShipments,
        popularDestinations,
        topShipments,
      },
      orders: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        ordersOverTime,
        revenue: Number(totalPriceOfOrders[0].total),
      },
    });
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
};

export { getAllStats };
