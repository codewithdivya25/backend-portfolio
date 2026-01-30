import app from "./app.js"
import cloudinary from "cloudinary"
import ErrorHandler from "./middlewares/error.js";
//import { Message } from "./Models/messageSchema.js";
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,

    api_secret:process.env.CLOUDINARY_API_SECRET,
    
})
app.listen(process.env.PORT, ()=> {
    console.log(`server listing at port ${process.env.PORT}`);
    
})

// update password
export const updatePassword = async (req,res, next) => {
    const {currentPassword, newPassword, confirmPassword} = req.body;
    if(!currentPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("Please  Fill All Fields", 400));

    }
    const user = await User. findById(req.User.id).select("+password")
    isPasswordMatched = await user.comparePassword(currentPassword)
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect Current Password", 400))
    }
    if(newPassword !== confirmPassword) {
        return next(
            new ErrorHandler("New Password And Confirm  New Password  Do Not Match..", 400)
        )
    }

    user.password = newPassword
    await  user.save();

    res.status(200).json({
        success: true,
        Message: "Password Update Successfully"
    })
}