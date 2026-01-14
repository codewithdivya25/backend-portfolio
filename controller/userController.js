
import ErrorHandler from "../middlewares/error.js";
import { User } from "../Models/UserSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../Utils/jwtToken.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";



export const register = catchAsyncErrors(async (req, res, next) => {

    // ✅ Files check
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Avatar and Resume are required!", 400));
    }

    const { avatar, resume } = req.files;

    // ✅ Upload Avatar
    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: "AVATARS" }
    );

    if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
        return next(
            new ErrorHandler(
                cloudinaryResponseForAvatar?.error?.message || "Avatar upload failed",
                500
            )
        );
    }

    // ✅ Upload Resume (PDF/DOC)
    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {
            folder: "MY_RESUMES",
            resource_type: "raw"
        }
    );

    if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
        return next(
            new ErrorHandler(
                cloudinaryResponseForResume?.error?.message || "Resume upload failed",
                500
            )
        );
    }

    // ✅ Body data
    const {
        fullName,
        email,
        phone,
        aboutme,
        password,
        portfolioURL,
        githubURL,
        linkedinURL,
        instagramURL
    } = req.body;

    // ✅ Create user
    await User.create({
        fullName,
        email,
        phone,
        aboutme,
        password,
        portfolioURL,
        githubURL,
        linkedinURL,
        instagramURL,
        avatar: {
            public_id: cloudinaryResponseForAvatar.public_id,
            url: cloudinaryResponseForAvatar.secure_url
        },
        resume: {
            public_id: cloudinaryResponseForResume.public_id,
            url: cloudinaryResponseForResume.secure_url
        }
    });
    generateToken(User, "registration successfully!", 201, res)
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Email and Password Are Required!"))
    }
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Inavalid Email or Passowrd!"))


    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Inavalid Email or Passowrd!"))


    }
    generateToken(user, "Login Sucessfully!", 200, res)

})

export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,


    }).json({
        success: true,
        message: "Logged out successfully"
    });
});


export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        User,

    })
})



export const UpdateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutme: req.body.aboutme,
        portfolioURL: req.body.portfolioURL,
        githubURL: req.body.githubURL,
        linkedinURL: req.body.linkedinURL,
        instagramURL: req.body.instagramURL
    };

    const user = await User.findById(req.user.id);

    // ✅ Avatar Update
    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;

        if (user.avatar?.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        const avatarUpload = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            { folder: "AVATARS" }
        );

        newUserData.avatar = {
            public_id: avatarUpload.public_id,
            url: avatarUpload.secure_url
        };
    }

    // ✅ Resume Update
    if (req.files && req.files.resume) {
        const resume = req.files.resume;

        if (user.resume?.public_id) {
            await cloudinary.uploader.destroy(user.resume.public_id);
        }

        const resumeUpload = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "RESUMES", resource_type: "raw" }
        );

        newUserData.resume = {
            public_id: resumeUpload.public_id,
            url: resumeUpload.secure_url
        };
    }

    // ✅ Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        newUserData,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
    });
});
