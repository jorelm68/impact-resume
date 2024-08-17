import { FieldValue, Timestamp } from "firebase/firestore";

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
    majors: string[] | null;
    startDate: Timestamp | FieldValue | null;
    endDate: Timestamp | FieldValue | null;
    classOf: number | null;
    bullets: string[] | null;
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