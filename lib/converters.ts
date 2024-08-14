import { DocumentSnapshot, FirestoreDataConverter, QueryDocumentSnapshot } from "firebase/firestore";
import { Additional, Bullet, Education, Experience, Resume, User } from "./types";

// Firestore data converter for User
export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: User) {
        return {
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
        };
    },
    fromFirestore(snapshot: DocumentSnapshot) {
        const data = snapshot.data();
        return {
            email: data?.email || '',
            photoURL: data?.photoURL || '',
            displayName: data?.displayName || '',
        } as User;
    },
};


// Firestore data converter for Resume
export const resumeConverter: FirestoreDataConverter<Resume> = {
    toFirestore(resume: Resume) {
        return {
            fullName: resume.fullName,
            email: resume.email,
            linkedInURL: resume.linkedInURL,
            address: resume.address,
            phone: resume.phone,
            displayAddress: resume.displayAddress,
            displayPhone: resume.displayPhone,
            education: resume.education,
            experience: resume.experience,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Resume>) {
        const data = snapshot.data();
        return {
            fullName: data?.fullName || '',
            email: data?.email || '',
            linkedInURL: data?.linkedInURL || '',
            address: data?.address || '',
            phone: data?.phone || '',
            displayAddress: data?.displayAddress || false,
            displayPhone: data?.displayPhone || false,
            education: data?.education || [],
            experience: data?.experience || [],
        } as Resume;
    },
}

// Firestore data converter for Experience
export const experienceConverter: FirestoreDataConverter<Experience> = {
    toFirestore(experience: Experience) {
        return {
            title: experience.title,
            organization: experience.organization,
            displayOrganizationAs: experience.displayOrganizationAs,
            industry: experience.industry,
            function: experience.function,
            startDate: experience.startDate,
            endDate: experience.endDate,
            address: experience.address,
            displayAddress: experience.displayAddress,
            workPhone: experience.workPhone,
            bullets: experience.bullets,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Experience>) {
        const data = snapshot.data();
        return {
            title: data?.title || '',
            organization: data?.organization || { name: '', industry: '' },
            displayOrganizationAs: data?.displayOrganizationAs || '',
            industry: data?.industry || '',
            function: data?.function || '',
            startDate: data?.startDate || '',
            endDate: data?.endDate || '',
            address: data?.address || '',
            displayAddress: data?.displayAddress || false,
            workPhone: data?.workPhone || '',
            bullets: data?.bullets || [],
        } as Experience;
    }
}

// Firestore data converter for Education
export const educationConverter: FirestoreDataConverter<Education> = {
    toFirestore(education: Education) {
        return {
            school: education.school,
            college: education.college,
            degree: education.degree,
            majors: education.majors,
            startDate: education.startDate,
            endDate: education.endDate,
            classOf: education.classOf,
            bullets: education.bullets,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Education>) {
        const data = snapshot.data();
        return {
            school: data?.school || { name: '', address: '' },
            college: data?.college || '',
            degree: data?.degree || '',
            majors: data?.majors || [],
            startDate: data?.startDate || '',
            endDate: data?.endDate || '',
            classOf: data?.classOf || 0,
            bullets: data?.bullets || [],
        } as Education;
    }
}

// Firestore data converter for Bullet
export const bulletConverter: FirestoreDataConverter<Bullet> = {
    toFirestore(bullet: Bullet) {
        return {
            text: bullet.text,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Bullet>) {
        const data = snapshot.data();
        return {
            text: data?.text || '',
        } as Bullet;
    }
}

// Firestore data converter for Additional
export const additionalConverter: FirestoreDataConverter<Additional> = {
    toFirestore(additional: Additional) {
        return {
            bullets: additional.bullets,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Additional>) {
        const data = snapshot.data();
        return {
            bullets: data?.bullets || [],
        } as Additional;
    }
}