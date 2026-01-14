import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required!"]
    },
    aboutme: {
        type: String,
        required: [true, "About Me field is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: [8, "Password must contain at least 8 characters!"],
        select: false
    },
    avatar: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    resume: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    portfolioURL: {
        type: String,
        required: [true, "Portfolio URL is required!"]
    },
    githubURL: String,
    linkedinURL: String,
    instagramURL: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES }
    );
};


export const User = mongoose.model("User", userSchema);
