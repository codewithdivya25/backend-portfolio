import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import  ErrorHandler from "../middlewares/error.js"
import {Skill}  from "../Models/SkillSchema.js"
import {v2 as cloudinary} from "cloudinary";


 export const addNewSkill = catchAsyncErrors(async (req, res, next) => {

  // Check file upload
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Skill SVG is required", 400));
  }

  const { svg } = req.files;
  const { title, proficiency } = req.body;

  // Validate fields
  if (!title || !proficiency) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    svg.tempFilePath,
    { folder: "Portfolio_Skills_svgs" }
  );

  // Check Cloudinary error
  if (!cloudinaryResponse) {
    return next(new ErrorHandler("Cloudinary upload failed", 500));
  }

  // Save skill in database
  const skill = await Skill.create({
    title,
    proficiency,
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // Success response
  res.status(200).json({
    success: true,
    message: "New skill added successfully",
    skill,
  });
});



 // DELETE Skill


 export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  
  const skill = await Skill.findById(id);

  if (!skill) {
    return next(new ErrorHandler("Skill not found", 404));
  }

  
  const skillSvgId = skill.svg.public_id;
  await cloudinary.uploader.destroy(skillSvgId);

  
  await skill.deleteOne();

  res.status(200).json({
    success: true, 
    message: "Skill deleted successfully",
  });
});
 

// Update Skill
   export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found", 404));
  }

  const { proficiency } = req.body;

  await Skill.findByIdAndUpdate(
    id,
    { proficiency },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
  });
});

    export const getAllSkills = catchAsyncErrors(async (req,res,next) => {
      const skills = await Skill.find();
      res.status(200).json({
        success : true,
        skills
      })
    })