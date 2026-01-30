import mongoose from "mongoose";
import { User } from "../Models/UserSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("User not authenticated!", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(new ErrorHandler("Invalid token. Please login again!", 401));
  }

  
  if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
    return next(new ErrorHandler("Invalid user id. Please login again!", 401));
  }

  const user = await User.findById(decoded.id);
  

  if (!user) {
    return next(new ErrorHandler("User does not exist. Please login again!", 401));
  }

  req.user = user;
  next();
});