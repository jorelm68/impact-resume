import { DocumentSnapshot, FirestoreDataConverter } from "firebase/firestore";
import { Resume, User } from "./types";

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
            additional: resume.additional,
            hiddenBullets: resume.hiddenBullets,
            hiddenExperience: resume.hiddenExperience,
            hiddenEducation: resume.hiddenEducation,
        };
    },
    fromFirestore(snapshot: DocumentSnapshot) {
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
            additional: data?.additional || '',
            hiddenBullets: data?.hiddenBullets || [],
            hiddenExperience: data?.hiddenExperience || [],
            hiddenEducation: data?.hiddenEducation || [],
        } as Resume;
    },
}