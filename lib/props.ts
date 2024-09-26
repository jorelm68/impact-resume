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
    resumeSlug: string;
    doc: DocumentData;
    docRef: DocumentReference<DocumentData>;
    bulletSlug: string;
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
export interface DraggableItemProps {
    dragHandleProps?: any;
    children: React.ReactNode;
    isSelected: boolean;
    onToggleSelect: ChangeEventHandler<HTMLInputElement>;
}

export interface SectionItemProps {
    resumeSlug: string;
    sectionSlug: string;
}

export interface ResumePartProps {
    selection: string[];
    resumeSlug: string;
    onToggleSelect: (bulletSlug: string) => void;
}

export interface EducationItemProps {
    isEditing: boolean;
    dragHandleProps?: any;
    resumeSlug: string;
    educationSlug: string;
}

export interface ExperienceItemProps {
    isEditing: boolean;
    resumeSlug: string;
    experienceSlug: string;
    dragHandleProps?: any;
}
export interface ProjectItemProps {
    isEditing: boolean;
    resumeSlug: string;
    projectSlug: string;
    dragHandleProps?: any;
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

export interface HeaderProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    resumeSlug: string;
    sectionName: string;
    dragHandleProps: any;
}