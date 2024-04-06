import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const missingFields: string[] = [];

  if (!firstName) missingFields.push("firstName");
  if (!lastName) missingFields.push("lastName");
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");

  if (missingFields.length) {
    res.status(400);
    throw new Error(`Missing mandatory fields: ${missingFields.join(", ")}`);
  }

  const isUserRegistered = await User.findOne({ email });
  if (isUserRegistered) {
    res.status(400);
    throw new Error("User already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({ user });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password fields are mandatory");
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret) {
    res.status(500);
    throw new Error("Internal server error - ACCESS_TOKEN_SECRET not defined");
  }
  if (!refreshTokenSecret) {
    res.status(500);
    throw new Error("Internal server error - REFRESH_TOKEN_SECRET not defined");
  }

  const user = await User.findOne({ email }).select("+password").exec();

  if (user && (await bcrypt.compare(password, user.password))) {
    const refreshToken = jwt.sign(
      { user: { id: user._id } },
      refreshTokenSecret,
      {
        expiresIn: "1d",
      }
    );
    const accessToken = jwt.sign(
      { user: { id: user._id } },
      accessTokenSecret,
      {
        expiresIn: "15m",
      }
    );
    const accessExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    const refreshExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const { password, ...others } = user.toObject();

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        expires: refreshExpiry,
      })
      .json({ accessToken, accessExpiry, user: others });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!refreshTokenSecret) {
    res.status(500);
    throw new Error("Internal server error - REFRESH_TOKEN_SECRET not defined");
  }
  if (!accessTokenSecret) {
    res.status(500);
    throw new Error("Internal server error - ACCESS_TOKEN_SECRET not defined");
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);

    if (!decoded || typeof decoded === "string") {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    const accessToken = jwt.sign({ user: decoded.user }, accessTokenSecret, {
      expiresIn: "15m",
    });
    const accessExpiry = new Date(Date.now() + 15 * 60 * 1000);

    res.status(200).json({ accessToken, accessExpiry });
  } catch (error) {
    res.status(401);
    throw new Error("User is not authorized");
  }
});

const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { id, firstName, lastName, email } = user;

  res.status(200).json({
    user: {
      id,
      firstName,
      lastName,
      email,
    },
  });
});

export { register, login, refreshToken, getUserDetails };
