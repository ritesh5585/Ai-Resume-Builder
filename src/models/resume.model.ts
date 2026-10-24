import mongoose from "mongoose";
import { Resume } from "@/types/resume.type";

const resumeSchema = new mongoose.Schema<Resume>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    skills: {
      type: String,
      default: "",
    },
    targetRole: {
      type: String,
      default: "",
    },
    experienceLevel: {
      type: String,
      default: "",
    },
    template: {
      type: String,
      default: "classic",
    },
    personalInfo: {
      type: {
        fullname: String,
        email: String,
        mobile: String,
        location: String,
        githubURL: String,
        portfolio: String,
      },
      default: {},
    },
    workExp: {
      type: [
        {
          company: String,
          position: String,
          startDate: String,
          endDate: String,
          description: String,
        },
      ],
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          githubURL: String,
          liveURL: String,
          techStack: [String],
        },
      ],
    },
    educations: {
      type: [
        {
          institute: String,
          degree: String,
          startDate: String,
          endDate: String,

        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const resumenModel = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default resumenModel;
