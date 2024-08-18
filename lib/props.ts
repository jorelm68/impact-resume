import { DocumentData, DocumentReference } from "firebase/firestore";
import { Additional, Education, Experience, Resume } from "./types";

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
    resumeSlug: string;
}

export interface TextProps extends React.HTMLProps<HTMLParagraphElement> {
    children: React.ReactNode;
}

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export interface BulletPartProps {
    doc: Additional | Education | Experience,
    docRef: DocumentReference<Additional | Education | Experience>, 
    resumeSlug: string,
    bulletSlug: string
}

export interface ButtonProps {
    onClick?: () => Promise<void> | void;
}