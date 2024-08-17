import { Resume } from "./types";

export interface AuthCheckProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export interface ResumeFeedProps {
    resumes: Resume[];
}

export interface ExperiencesPageProps {
    params: {
        uid: string;
        resume: string;
    }
}

export interface EducationPageProps {
    params: {
        uid: string;
        resume: string;
    }
}

export interface AdditionalPageProps {
    params: {
        uid: string;
        resume: string;
    }
}

export interface ResumePageProps {
    resume: string;
}

export interface TextProps extends React.HTMLProps<HTMLParagraphElement> {
    children: React.ReactNode;
}