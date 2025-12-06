import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new apiError(401, "unauthorized request");
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken -emailVerificationToken"
  );

  if (!user) {
    throw new apiError(401, "Invalid access token");
  }
  req.user = user;
  next();
});
