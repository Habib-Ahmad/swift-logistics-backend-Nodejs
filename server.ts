import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config";
import { userRouter } from "./routes";
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
    origin: ["http://localhost:3000"],
  })
);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(errorHandler(false));
