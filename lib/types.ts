import { FieldValue, Timestamp } from "firebase/firestore";

export interface User { 
    email: string;
    displayName: string;
    photoURL: string;
}

export interface School {
    name: string;
    address: string;
}

export interface Bullet {
    text: string;
}

export interface Education {
    school: School;
    college: string | null;
    degree: string;
    majors: string[] | null;
    startDate: Timestamp | FieldValue | null;
    endDate: Timestamp | FieldValue | null;
    classOf: number | null;
    bullets: string[] | null;
}


export interface Organization {
    name: string;
    industry: string | null;
}

export interface Experience {
    title: string;
    organization: Organization;
    displayOrganizationAs: string | null;
    industry: string | null;
    function: string | null;
    startDate: Timestamp | FieldValue | null;
    endDate: Timestamp | FieldValue | null;
    address: string | null;
    displayAddress: boolean;
    workPhone: string | null;
    bullets: string[] | null;
}

export interface Additional {
    bullets: string[] | null;
}

export interface Resume {
    fullName: string | null;
    email: string | null;
    linkedInURL: string | null;
    address: string | null;
    phone: string | null;
    displayAddress: boolean;
    displayPhone: boolean;

    education: string[] | null;
    experience: string[] | null;
}