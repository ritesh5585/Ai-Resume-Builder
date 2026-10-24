import { Types } from "mongoose";

export interface PersonalInfo {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  githubURL: string;
  portfolio: string;
}
export interface WorkExp {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  githubURL: string;
  liveURL: string;
  techStack: string[];
}


export interface Education {
  institute: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Resume {
  _id?: string;
  user_id: Types.ObjectId;
  title: string;
  summary: string;
  targetRole?: string;
  experienceLevel?: string;
  template?: string;
  skills: string;
  personalInfo: PersonalInfo;
  workExp?: WorkExp[];
  projects: Project[];
  educations: Education[];
  certificate?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
