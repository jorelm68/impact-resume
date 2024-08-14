import { DocumentSnapshot, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
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
            slug: resume.slug,
            fullName: resume.fullName,
            email: resume.email,
            linkedInURL: resume.linkedInURL,
            address: resume.address,
            phone: resume.phone,
            displayAddress: resume.displayAddress,
            displayPhone: resume.displayPhone,
            education: resume.education,
            experience: resume.experience,
            createdAt: typeof resume.createdAt === 'number' ? Timestamp.fromMillis(resume.createdAt) : resume.createdAt,
            updatedAt: typeof resume.updatedAt === 'number' ? Timestamp.fromMillis(resume.updatedAt) : resume.updatedAt,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Resume>) {
        const data = snapshot.data();
        return {
            slug: data?.slug || '',
            fullName: data?.fullName || '',
            email: data?.email || '',
            linkedInURL: data?.linkedInURL || '',
            address: data?.address || '',
            phone: data?.phone || '',
            displayAddress: data?.displayAddress || false,
            displayPhone: data?.displayPhone || false,
            education: data?.education || [],
            experience: data?.experience || [],
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : 0,
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
            location: experience.location,
            workPhone: experience.workPhone,
            bullets: experience.bullets,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Experience>) {
        const data = snapshot.data();
        return {
            title: data?.title || null,
            organization: data?.organization || null,
            displayOrganizationAs: data?.displayOrganizationAs || null,
            industry: data?.industry || null,
            function: data?.function || null,
            startDate: data?.startDate || null,
            endDate: data?.endDate || null,
            location: data?.location || null,
            workPhone: data?.workPhone || null,
            bullets: data?.bullets || null,
        } as Experience;
    }
}

// Firestore data converter for Education
export const educationConverter: FirestoreDataConverter<Education> = {
    toFirestore(education: Education) {
        return {
            school: education.school,
            location: education.location,
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
            school: data?.school || null,
            location: data?.location || null,
            college: data?.college || null,
            degree: data?.degree || null,
            majors: data?.majors || null,
            startDate: data?.startDate || null,
            endDate: data?.endDate || null,
            classOf: data?.classOf || null,
            bullets: data?.bullets || null,
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