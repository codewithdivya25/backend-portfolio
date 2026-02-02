import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    gitRepo: {
      type: String,
      required: true,
    },

    ProjectLink: {
      type: String,
      required: true,
    },

    stack: {
      type: String,
      required: true,
    },

    deployed: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    projectBanner: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
