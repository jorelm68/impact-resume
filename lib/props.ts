import { DocumentData, DocumentReference } from "firebase/firestore";
import { Education, Experience, Resume } from "./types";
import { ChangeEvent, ChangeEventHandler } from "react";

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
    selection: string[];
    doc: Resume | Education | Experience,
    docRef: DocumentReference<Resume | Education | Experience>, 
    resumeSlug: string,
    bulletSlug: string,
    onToggleSelect: (bulletSlug: string) => void,
    dragHandleProps?: any; // Add this line to accept dragHandleProps
}

export interface ButtonProps {
    onClick?: () => Promise<void> | void;
}

export interface DotsProps {
    dragHandleProps?: any;
}
export interface CheckboxProps {
    isChecked: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
}
export interface SectionProps {
    dragHandleProps?: any;
    children: React.ReactNode;
    isSelected: boolean;
    onToggleSelect: ChangeEventHandler<HTMLInputElement>;
}

export interface AdditionalPartProps {
    selection: string[];
    resumeSlug: string;
    onToggleSelect: (bulletSlug: string) => void;
}

export interface ResumePartProps {
    selection: string[];
    resumeSlug: string;
    onToggleSelect: (bulletSlug: string) => void;
}

export interface EducationPartProps {
    onDeleteEducation: (educationDocRef: DocumentReference<Education>) => Promise<void>;
    isEditing: boolean;
    dragHandleProps?: any;
    selection: string[];
    resumeSlug: string;
    educationSlug: string;
    onToggleSelect: (bulletSlug: string) => void;
}

export interface ExperiencePartProps {
    onDeleteExperience: (experienceDocRef: DocumentReference<Experience>) => Promise<void>;
    isEditing: boolean;
    dragHandleProps?: any;
    selection: string[];
    resumeSlug: string;
    experienceSlug: string;
    onToggleSelect: (bulletSlug: string) => void;
}


export interface PDFButtonProps {
    resumeSlug: string;
}

export interface ResumePDFProps {
    resumeSlug: string;
}

export interface GenericButtonProps {
    onClick?: () => Promise<void> | void;
    style?: object;
    children: React.ReactNode;
}