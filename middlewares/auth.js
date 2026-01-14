import { User } from "../Models/UserSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorHandler("User not authenticated!", 401));
    }
  

    console.log("TOKEN:", token);

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        return next(new ErrorHandler("Invalid token. Please login again!", 401));
    }
    console.log("SECRET:", process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    console.log("DECODED:", decoded);


    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    req.user = user;
    next();
});
