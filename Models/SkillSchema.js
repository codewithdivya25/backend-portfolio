import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String,
    required: true,
  },
  svg: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

export const Skill = mongoose.model("Skill", skillsSchema);
