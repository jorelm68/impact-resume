import { DocumentReference, FieldValue, Timestamp } from "firebase/firestore";

export interface User { 
    email: string;
    displayName: string;
    photoURL: string;
}

export interface Bullet {
    slug: string;
    text: string;
}

export type SubmitResumeFields = "fullName" | "email" | "linkedInURL" | "address" | "phone";
export type SubmitEducationFields = "school" | "location" | "college" | "degree" | "startDate" | "endDate";
export type SubmitExperienceFields = "title" | "organization" | "industry" | "function" | "startDate" | "endDate" | "location" | "workPhone";
export type SubmitProjectFields = "name" | "link" | "github" | "github2" | "techStack" | "languages" | "industry" | "function" | "location" | "workPhone";

export type EditableType = "text" | "timestamp";
export type EditableValue = string | Timestamp | null;
export type TimeFormat = 'M, Y' | 'H:M(am/pm) M D, Y' | 'YYYY-MM-DD' | 'YYYY';

export interface EducationHook {
    education: Education | null;
    educationDocRef: DocumentReference<Education> | null;
}

export interface ExperienceHook {
    experience: Experience | null;
    experienceDocRef: DocumentReference<Experience> | null;
}

export interface ProjectHook {
    project: Project | null;
    projectDocRef: DocumentReference<Project> | null;
}

export interface BulletHook {
    bullet: Bullet | null;
    bulletDocRef: DocumentReference<Bullet> | null;
}

export interface ResumeHook {
    resume: Resume | null;
    resumeDocRef: DocumentReference<Resume> | null;
}

export interface Education {
    slug: string;
    school: string | null;
    location: string | null;
    college: string | null;
    degree: string | null;
    startDate: Timestamp | FieldValue | null;
    endDate: Timestamp | FieldValue | null;
    bullets: string[];
}

export interface Experience {
    slug: string;
    title: string | null;
    organization: string | null;
    industry: string | null;
    function: string | null;
    startDate: Timestamp | FieldValue | null;
    endDate: Timestamp | FieldValue | null;
    location: string | null;
    workPhone: string | null;
    bullets: string[];
}

export interface Project {
    slug: string;
    name: string | null;
    industry: string | null;
    function: string | null;
    link: string | null;
    github: string | null;
    github2: string | null;
    techStack: string | null;
    languages: string | null;
    location: string | null;
    workPhone: string | null;
    bullets: string[];
}

export interface Section {
    slug: string;
    name: string;
    bullets: string[];
}

export interface SectionHook {
    section: Section | null;
    sectionDocRef: DocumentReference<Section> | null;
}

export interface Resume {
    slug: string;
    resumeName: string;
    fullName: string | null;
    email: string | null;
    linkedInURL: string | null;
    address: string | null;
    phone: string | null;

    educations: string[];
    experiences: string[];
    projects: string[];
    sections: string[];
    selected: string[];

    createdAt: number | FieldValue | null;
    updatedAt: number | FieldValue | null;
}

export interface UserHook {
    user: User | null;
    userDocRef: DocumentReference<User> | null;
}

export interface ContactInfo {
    numContacts: number;
    one: string | null;
    two: string | null;
    three: string | null;
    hasEmail: boolean;
    hasLinkedInURL: boolean;
    hasPhone: boolean;
    hasAddress: boolean;
}