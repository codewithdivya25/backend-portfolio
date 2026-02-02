import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import { Project } from "../Models/ProjectSchema.js";
import {v2 as cloudinary } from "cloudinary";




  export const addNewProject = catchAsyncErrors(async (req, res, next) => {

  // 1️⃣ Image check
  if (!req.files || !req.files.ProjectBanner) {
    return next(new ErrorHandler("Project Banner Image Required", 400));
  }

  const { ProjectBanner } = req.files;

  // 2️⃣ Body fields (Postman naming)
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    deployed,
  } = req.body;

  // 3️⃣ Validation
  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !projectLink ||
    !stack ||
    deployed === undefined
  ) {
    return next(new ErrorHandler("Please Fill All Fields", 400));
  }

  // 4️⃣ Enum safety
  if (!["yes", "no"].includes(deployed)) {
    return next(new ErrorHandler("Deployed must be yes or no", 400));
  }

  // 5️⃣ Upload image
  const cloudinaryResponse = await cloudinary.uploader.upload(
    ProjectBanner.tempFilePath,
    { folder: "PROJECT_IMAGES" }
  );

  // 6️⃣ Create project (schema mapping)
  const newProject = await Project.create({
    title,
    description,
    gitRepo: gitRepoLink,
    ProjectLink: projectLink,
    stack,
    deployed,
    projectBanner: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // 7️⃣ Response
  res.status(201).json({
    success: true,
    message: "New project added successfully!",
    project: newProject,
  });
})
// update Project
export const updateProject = catchAsyncErrors(async (req, res, next) => {


  if (!req.body) {
    return next(new ErrorHandler("Request body missing", 400));
  }

  // 1️⃣ Find project
  let project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

 
  // 3️⃣ Body mapping
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    gitRepo: req.body.gitRepoLink,
    ProjectLink: req.body.projectLink,
    stack: req.body.stack,
    deployed: req.body.deployed,
  };

  // 4️⃣ Image update
  if (req.files && req.files.ProjectBanner) {

    await cloudinary.uploader.destroy(
      project.projectBanner.public_id
    );

    const cloudinaryResponse = await cloudinary.uploader.upload(
      req.files.ProjectBanner.tempFilePath,
      { folder: "PROJECT_IMAGES" }
    );

    newProjectData.projectBanner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // 5️⃣ Update DB
  project = await Project.findByIdAndUpdate(
    req.params.id,
    newProjectData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Project Updated Successfully",
    project,
  });
});

// delete project 
export const  deleteProject = catchAsyncErrors(async (req, res, next) =>{
  const {id} = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new  ErrorHandler("Project  Not Found!", 404));
}
await project.deleteOne();
res.status(200).json({
  success: true,
  message: "Project Deleted!"
})
})
// all project
export const  getAllProject = catchAsyncErrors(async (req, res, next) =>{
  const projects  = await Project.find();
  res.status(200).json({
    success: true,
    projects,
  }) 
})

//  add single project 
export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const project = await Project.findById(id); 

  if (!project) {
    return next(new ErrorHandler("PROJECT NOT FOUND!", 404));
  }

  res.status(200).json({
    success: true,
    project,
  });
  

});
