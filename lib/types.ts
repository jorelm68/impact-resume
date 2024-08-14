export interface Address {
    street: string | undefined;
    city: string;
    state: string | undefined;
    zip: string | undefined;
    country: string;
}

export type PhoneType = 'home' | 'work' | 'cell';
export interface Phone {
    areaCode: number | undefined;
    number: number | undefined;
    type: PhoneType | undefined;
    extension: number | undefined;
    country: string | undefined;
}

export interface Contact {
    fullName: string | undefined;
    email: string | undefined;
    linkedInURL: string | undefined;
    address: Address | undefined;
    displayAddress: boolean;
    phone: Phone | undefined;
    displayPhone: boolean;
}

export interface ResumeDate {
    month: number | undefined;
    year: number | undefined;
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
    college: string | undefined;
    degree: string;
    majors: string[] | undefined;
    startDate: ResumeDate;
    graduationDate: ResumeDate | undefined;
    classOf: number | undefined;
    bullets: Bullet[] | undefined;
}


export interface Organization {
    name: string;
    industry: string | undefined;
}

export interface Experience {
    title: string;
    organization: Organization;
    displayOrganizationAs: string | undefined;
    industry: string | undefined;
    function: string | undefined;
    startDate: ResumeDate;
    endDate: ResumeDate | 'Present';
    address: Address | undefined;
    displayAddress: boolean;
    workPhone: Phone | undefined;
    bullets: Bullet[] | undefined;
}

export interface Additional {
    bullets: Bullet[] | undefined;
}

export interface Resume {
    contact: Contact;
    education: Education[];
    experience: Experience[];
    additional: Additional | undefined;

    hiddenBullets: string[];
    hiddenExperience: string[];
    hiddenEducation: string[];
}