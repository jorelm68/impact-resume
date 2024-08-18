import { DocumentSnapshot, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { Additional, Bullet, Education, Experience, Resume, User } from "./types";

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