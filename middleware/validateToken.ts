import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const validateToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (
      !authHeader ||
      Array.isArray(authHeader) ||
      !authHeader.startsWith("Bearer")
    ) {
      res.status(401);
      throw new Error("Invalid token payload");
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessTokenSecret) {
      res.status(500);
      throw new Error(
        "Internal server error - ACCESS_TOKEN_SECRET not defined"
      );
    }

    try {
      const decoded = jwt.verify(accessToken, accessTokenSecret);

      if (!decoded || typeof decoded === "string") {
        res.status(401);
        throw new Error("Invalid token payload");
      }

      req.user = decoded.user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("User is not authorized");
    }
  }
);

export default validateToken;
