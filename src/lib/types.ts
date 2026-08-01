export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photo: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  country: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: { name: string; level: string }[];
  projects: Project[];
  certifications: Certification[];
  references: Reference[];
}

export const emptyCVData: CVData = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    photo: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  references: [],
};
