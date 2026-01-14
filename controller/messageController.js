import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../Models/messageSchema.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, subject, message } = req.body;

    if (!senderName || !subject || !message) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }

    const data = await Message.create({ senderName, subject, message });

    res.status(200).json({
        success: true,
        message: "Message sent successfully!",
        data,
    });
});


export  const getAllmessges = catchAsyncErrors(async(req,res,next) =>{
    const message = await Message.find();
    res.status(200).json({
        success: true,
        message
    })

})
export const deleteMessage =  catchAsyncErrors(async(req,res,next) => {
    const{id} = req.params;
    const message = await Message.findById(id); 

    if(!Message
    ){
        return next(new ErrorHandler("Message Already deleted!", 400 ));

    }
    await Message.deleteOne();
    res.status(200).json({
        success:true,
        Message:"Message Deleted "
    })
})

