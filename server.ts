import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config";
import {
  driverRouter,
  orderRouter,
  shipmentRouter,
  shipmentInstancesRouter,
  stationRouter,
  userRouter,
  vehicleRouter,
  statisticsRouter,
} from "./routes";
import errorHandler from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app: Express = express();

connectDb();

const port = process.env.PORT || 8001;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Swift Logistics Server!");
});

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: [
      "http://localhost:3000",
      "https://swift-logistics-frontend.onrender.com",
    ],
  })
);

app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/stations", stationRouter);
app.use("/api/shipments", shipmentRouter);
app.use("/api/shipmentInstances", shipmentInstancesRouter);
app.use("/api/orders", orderRouter);
app.use("/api/statistics", statisticsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(errorHandler(false));
