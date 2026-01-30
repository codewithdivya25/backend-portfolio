import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Timeline } from "../Models/timeLineSchema.js";
import mongoose from "mongoose";

 

// ADD TIMELINE
export const PostTimeLine = catchAsyncErrors(async (req, res, next) => {
  const { title, description, from, to } = req.body;

  const newTimeline = await Timeline.create({
    title,
    description,
    timeLine: { from, to },
  });

  res.status(200).json({
    success: true,
    message: "Timeline Added successfully",
    newTimeline,
  });
});
 export const deleteTimeLine = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid _id", 400));
  }

  const timeline = await Timeline.findById(id);

  if (!timeline) {
    return next(new ErrorHandler("Timeline not found", 404));
  }

  await timeline.deleteOne();

  res.status(200).json({
    success: true,
    message: "Timeline deleted successfully",
  });
});
 export const getAllTimeLine  = catchAsyncErrors(async (req, res, next) => {
  const timeLines = await Timeline.find();
  res.status(200).json({
    success:true,
    timeLines
  })
 });