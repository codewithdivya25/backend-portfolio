
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new mongoose.Schema(
  {
    // User full name
    fullName: {
      type: String,
      required: [true, "Name is required!"],
    },

    // User email (must be unique)
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
    },

    // User phone number
    phone: {
      type: String,
      required: [true, "Phone number is required!"],
    },

    // About me section
    aboutme: {
      type: String,
      required: [true, "About Me field is required!"],
    },

    // Password (hidden by default)
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [8, "Password must contain at least 8 characters!"],
      select: false,
    },

    // User avatar stored on Cloudinary
    avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },

    // Resume file stored on Cloudinary
    resume: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },

    // Portfolio website URL
    portfolioURL: {
      type: String,
      required: [true, "Portfolio URL is required!"],
    },

    // Social media links (optional)
    githubURL: String,
    linkedinURL: String,
    instagramURL: String,

    // Forgot password token (hashed)
    resetPasswordToken: String,

    // Forgot password token expiry time
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// PASSWORD HASHING
// Hash password before saving user
userSchema.pre("save", async function (next) {
  // If password is not modified, skip hashing
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password using bcrypt
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// PASSWORD COMPARISON

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token for authentication
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id }, // payload
    process.env.JWT_SECRET_KEY, // secret key
    { expiresIn: process.env.JWT_EXPIRES } // token expiry
  );
};

// FORGOT PASSWORD TOKEN 
// Generate and store password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate random reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and store in database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration time (15 minutes)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  // Return original token (to send via email)
  return resetToken;
};

// ================= EXPORT USER MODEL =================
export const User = mongoose.model("User", userSchema);
