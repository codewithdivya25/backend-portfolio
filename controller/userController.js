
import ErrorHandler from "../middlewares/error.js";
import { User } from "../Models/UserSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../Utils/jwtToken.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import crypto from "crypto"
import sendEmail from "../Utils/sendEmail.js";




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


//  Update Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(currentPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect current password", 400));
    }

    if (newPassword !== confirmNewPassword) {
        return next(
            new ErrorHandler("New password and confirm password do not match", 400)
        );
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});

// GET USER FOR PORTFOLIO
export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
    const id = "6964865f70859f441333e8ea";

    
    const user = await User.findById(id);

    res.status(200).json({
        success: true,
        user,
    });
});


// FORGOT PASSWORD
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Reset password URL
    const resetPasswordUrl = `${process.env.DASHBOARD_URL || "http://localhost:3000"}/password/reset/${resetToken}`;

    const message = `You requested a password reset.

Click on the link below to reset your password:
${resetPasswordUrl}

If you did not request this, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
             message: `Password reset email sent to ${user.email}`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler("Email could not be sent", 500));
    }
});


// reset Password
// Wrapper to handle async errors automatically
export const resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Get reset token from URL params  -> /password/reset/:token
    const { token } = req.params;

    // Hash the token using the same algorithm used during forgot password
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Find the user with:
    // 1. Matching reset token
    // 2. Token that has not expired
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    // If no user is found, token is invalid or expired
    if (!user) {
        return next(
            new ErrorHandler(
                "Reset password token is invalid or has expired",
                400
            )
        );
    }

    // Check if password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
        return next(
            new ErrorHandler(
                "Password and confirm password do not match",
                400
            )
        );
    }

    // Set the new password
    user.password = req.body.password;

    // Clear reset token fields (token is one-time use)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save the user (password hashing middleware will run)
    await user.save();

    // Send success response
    res.status(200).json({
        success: true,
        message: "Password reset successfully. Please login again."
    });
});
