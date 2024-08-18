import { DocumentReference, FieldValue, Timestamp } from "firebase/firestore";

export interface User { 
    email: string;
    displayName: string;
    photoURL: string;
}

export interface Bullet {
    text: string;
}

export interface Education {
    slug: string;
    school: string | null;
    location: string | null;
    college: string | null;
    degree: string;
    startDate: Timestamp | FieldValue | null;
    endDate: Timestamp | FieldValue | null;
    bullets: string[] | null;
}

export type SubmitResumeFields = "fullName" | "email" | "linkedInURL" | "address" | "phone";
export type SubmitResume = (field: SubmitResumeFields, newValue: string) => Promise<void>;
export type SubmitEducationFields = "school" | "location" | "college" | "degree" | "startDate" | "endDate";
export type SubmitEducation = (field: SubmitEducationFields, newValue: string | Timestamp | null) => Promise<void>;
export type SubmitExperienceFields = "title" | "organization" | "industry" | "function" | "startDate" | "endDate" | "location" | "workPhone";
export type SubmitExperience = (field: SubmitExperienceFields, newValue: string) => Promise<void>;

export interface EducationHook {
    education: Education | null;
    educationDocRef: DocumentReference<Education> | null;
}

export interface ExperienceHook {
    experience: Experience | null;
    experienceDocRef: DocumentReference<Experience> | null;
}

export interface AdditionalHook {
    additional: Additional | null;
    additionalDocRef: DocumentReference<Additional> | null;
}

export interface BulletHook {
    bullet: Bullet | null;
    bulletDocRef: DocumentReference<Bullet> | null;
}

export interface ResumeHook {
    resume: Resume | null;
    resumeDocRef: DocumentReference<Resume> | null;
}

export interface Experience {
    slug: string;
    title: string | null;
    organization: string | null;
    displayOrganizationAs: string | null;
    industry: string | null;
    function: string | null;
    startDate: Timestamp | FieldValue | null;
    endDate: Timestamp | FieldValue | null;
    location: string | null;
    workPhone: string | null;
    bullets: string[] | null;
}

export interface Additional {
    slug: string;
    bullets: string[] | null;
}

export interface Resume {
    slug: string;
    fullName: string | null;
    email: string | null;
    linkedInURL: string | null;
    address: string | null;
    phone: string | null;
    displayAddress: boolean;
    displayPhone: boolean;

    educations: string[] | null;
    experiences: string[] | null;
    additionals: string[] | null;

    createdAt: number | FieldValue | null;
    updatedAt: number | FieldValue | null;
}