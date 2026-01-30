import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import  {softwareApplication} from "../Models/softwareApplicationSchema.js"
import {  v2 as cloudinary} from "cloudinary"



export const addNewApplications = catchAsyncErrors(async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Software Application Icon/SVG required", 400));
    }

    const { svg } = req.files;
    const { name } = req.body;

    if (!name) {
        return next(new ErrorHandler("Software Application name is required", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        { folder: "Portfolio_Software_application" }
    );

    if (!cloudinaryResponse) {
        return next(new ErrorHandler("Cloudinary upload failed", 500));
    }

    const newApplication = await softwareApplication.create({
        name,
        svg: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    });

    res.status(201).json({
        success: true,
        message: "New Software Application added successfully",
        application: newApplication
    });
});

 export const deleteApplications = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const application = await softwareApplication.findById(id);

  if (!application) {
    return next(new ErrorHandler("Software Application not found", 404));
  }

  // Check if SVG exists
  if (!application.svg || !application.svg.public_id) {
    return next(
      new ErrorHandler("Software Application icon not found", 400)
    );
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(application.svg.public_id);

  // Delete from database
  await application.deleteOne();

  res.status(200).json({
    success: true,
    message: "Software Application deleted successfully",
  });
});
 export const getAllApplications = catchAsyncErrors(async(req,res, next) =>{
    const applications = await softwareApplication.find();
    res.status(200).json({
        success: true,
        applications
    })
 })