import { DocumentSnapshot, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { Bullet, Section, Education, Experience, Resume, User } from "./types";

// Firestore data converter for User
export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: User) {
        return {
            ...user,
        };
    },
    fromFirestore(snapshot: DocumentSnapshot) {
        const data = snapshot.data();
        return {
            ...data,
        } as User;
    },
};


// Firestore data converter for Resume
export const resumeConverter: FirestoreDataConverter<Resume> = {
    toFirestore(resume: Resume) {
        return {
            ...resume,
            createdAt: typeof resume.createdAt === 'number' ? Timestamp.fromMillis(resume.createdAt) : resume.createdAt,
            updatedAt: typeof resume.updatedAt === 'number' ? Timestamp.fromMillis(resume.updatedAt) : resume.updatedAt,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Resume>) {
        const data = snapshot.data();
        return {
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : 0,
        } as Resume;
    },
}

// Firestore data converter for Experience
export const experienceConverter: FirestoreDataConverter<Experience> = {
    toFirestore(experience: Experience) {
        return {
            ...experience,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Experience>) {
        const data = snapshot.data();
        return {
            ...data,
        } as Experience;
    }
}

// Firestore data converter for Education
export const educationConverter: FirestoreDataConverter<Education> = {
    toFirestore(education: Education) {
        return {
            ...education,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Education>) {
        const data = snapshot.data();
        return {
            ...data,
        } as Education;
    }
}

export const sectionConverter: FirestoreDataConverter<Section> = {
    toFirestore(section: Section) {
        return {
            ...section,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Section>) {
        const data = snapshot.data();
        return {
            ...data,
        } as Section;
    }
}

// Firestore data converter for Bullet
export const bulletConverter: FirestoreDataConverter<Bullet> = {
    toFirestore(bullet: Bullet) {
        return {
            ...bullet,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<Bullet>) {
        const data = snapshot.data();
        return {
            ...data,
        } as Bullet;
    }
}