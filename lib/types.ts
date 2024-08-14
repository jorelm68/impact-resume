export interface User { 
    email: string;
    displayName: string;
    photoURL: string;
}

export interface ResumeDate {
    month: number | null;
    year: number | null;
}


export interface School {
    name: string;
    address: string;
}

export interface Education {
    school: School;
    college: string | null;
    degree: string;
    majors: string[] | null;
    startDate: ResumeDate;
    graduationDate: ResumeDate | null;
    classOf: number | null;
    bullets: string[] | null;
    hiddenBullets: string[] | null;
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
    startDate: ResumeDate;
    endDate: ResumeDate | 'Present';
    address: string | null;
    displayAddress: boolean;
    workPhone: string | null;
    bullets: string[] | null;
    hiddenBullets: string[] | null;
}

export interface Additional {
    bullets: string[] | null;
    hiddenBullets: string[] | null;
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
    additional: string | null;
    hiddenEducation: string[] | null;
    hiddenExperience: string[] | null;
    hiddenBullets: string[] | null;
}