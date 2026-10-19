export interface GenerateSummary {
  experienceLevel: string;
  skills: string[];
  jobTitle: string;
}

export interface GenerateSkills {
  experienceLevel: string;
  jobTitle: string;
}
export interface GenerateProjectDetails {
  experienceLevel: string;
  jobTitle: string;
  techstack: string[];
}

export interface GenerateExperience {
  experienceLevel: string;
  jobRole: string;
  years: string;
    company?: string;
  techStack?: string; 
}

export interface ImproveContent {
  content: string;
  sectionType: string;
  jobTitle?: string;
}

export interface AnalyzeResume {
  resumeText: string;
  jobTitle: string;
  jobDescription?: string;
}