import mongoose from "mongoose";

const timelineScheema = new mongoose.Schema({
    title: {
        type: String,
       required: [true, "Title are required!!"],
    },
    description:{
        type:String,
        required:[true, "Description are required!!"],
},
timeLine:{
    from: String,
    to: String,

}

});

export const Timeline = mongoose.model("Timeline", timelineScheema);
