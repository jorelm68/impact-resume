import { useEffect, useState } from "react";
import { Additional, Bullet, Education, Experience, Resume, User } from "./types";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import { additionalConverter, bulletConverter, educationConverter, experienceConverter, resumeConverter, userConverter } from "./converters";

export function useResume(slug: string) {
    const [resume, setResume] = useState<Resume | null>(null);

    useEffect(() => {
        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);

        const resumeCollectionRef: CollectionReference<Resume> = collection(userDocRef, 'resumes').withConverter(resumeConverter);
        const resumeDocRef: DocumentReference<Resume> = doc(resumeCollectionRef, slug);
        const unsubscribe = onSnapshot(resumeDocRef, (snapshot: DocumentSnapshot<Resume>) => {
            const resume: Resume | undefined = snapshot.data();
            if (!resume) return;
            setResume(resume);
        })

        return () => unsubscribe();
    }, [slug]);

    return resume;
}

export function useResumes() {
    const [resumes, setResumes] = useState<Resume[] | null>(null);

    useEffect(() => {
        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);

        const resumesCollectionRef: CollectionReference<Resume> = collection(userDocRef, 'resumes').withConverter(resumeConverter);
        const unsubscribe = onSnapshot(resumesCollectionRef, (snapshot: QuerySnapshot<Resume>) => {
            const resumes: Resume[] = snapshot.docs.map((doc) => doc.data());
            setResumes(resumes);
        })

        return () => unsubscribe();
    }, []);

    return resumes;
}

export function useExperience(slug: string) { 
    const [experience, setExperience] = useState<Experience | null>(null);
    
    useEffect(() => {
        const userCollecitonRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollecitonRef, auth.currentUser?.uid);

        const experienceCollectionRef: CollectionReference<Experience> = collection(userDocRef, 'experiences').withConverter(experienceConverter);
        const experienceDocRef: DocumentReference<Experience> = doc(experienceCollectionRef, slug);
        const unsubscribe = onSnapshot(experienceDocRef, (snapshot: DocumentSnapshot<Experience>) => {
            const experience: Experience | undefined = snapshot.data();
            if (!experience) return;
            setExperience(experience);
        })

        return () => unsubscribe();
    }, [slug]);

    return experience;
}

const useExperiences = () => {
    const [experiences, setExperiences] = useState<Experience[] | null>(null);

    useEffect(() => {
        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);

        const experiencesCollectionRef: CollectionReference<Experience> = collection(userDocRef, 'experiences').withConverter(experienceConverter);
        const unsubscribe = onSnapshot(experiencesCollectionRef, (snapshot: QuerySnapshot<Experience>) => {
            const experiences: Experience[] = snapshot.docs.map((doc) => doc.data());
            setExperiences(experiences);
        })

        return () => unsubscribe();
    }, []);

    return experiences;
}

export function useEducation(slug: string) {
    const [education, setEducation] = useState<Education | null>(null);

    useEffect(() => {
        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);

        const educationCollectionRef: CollectionReference<Education> = collection(userDocRef, 'educations').withConverter(educationConverter);
        const educationDocRef: DocumentReference<Education> = doc(educationCollectionRef, slug);
        const unsubscribe = onSnapshot(educationDocRef, (snapshot: DocumentSnapshot<Education>) => {
            const education: Education | undefined = snapshot.data();
            if (!education) return;
            setEducation(education);
        })

        return () => unsubscribe();
    }, [slug]);

    return education;
}

export function useEducations() {
    const [educations, setEducations] = useState<Education[] | null>(null);

    useEffect(() => {
        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);

        const educationsCollectionRef: CollectionReference<Education> = collection(userDocRef, 'educations').withConverter(educationConverter);
        const unsubscribe = onSnapshot(educationsCollectionRef, (snapshot: QuerySnapshot<Education>) => {
            const educations: Education[] = snapshot.docs.map((doc) => doc.data());
            setEducations(educations);
        })

        return () => unsubscribe();
    }, []);

    return educations;
}

export function useAdditional(slug: string) {
    const [additional, setAdditional] = useState<Additional | null>(null);

    useEffect(() => {
        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);

        const additionalCollectionRef: CollectionReference<Additional> = collection(userDocRef, 'additionals').withConverter(additionalConverter);
        const additionalDocRef: DocumentReference<Additional> = doc(additionalCollectionRef, slug);
        const unsubscribe = onSnapshot(additionalDocRef, (snapshot: DocumentSnapshot<Additional>) => {
            const additional: Additional | undefined = snapshot.data();
            if (!additional) return;
            setAdditional(additional);
        })

        return () => unsubscribe();
    }, [slug]);

    return additional;
}

export function useAdditionals() {
    const [additionals, setAdditionals] = useState<Additional[] | null>(null);

    useEffect(() => {
        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);

        const additionalsCollectionRef: CollectionReference<Additional> = collection(userDocRef, 'additionals').withConverter(additionalConverter);
        const unsubscribe = onSnapshot(additionalsCollectionRef, (snapshot: QuerySnapshot<Additional>) => {
            const additionals: Additional[] = snapshot.docs.map((doc) => doc.data());
            setAdditionals(additionals);
        })

        return () => unsubscribe();
    }, []);

    return additionals;
}

export function useBullets(type: 'experience' | 'education' | 'additional', slug: string) {
    const [bullets, setBullets] = useState<Bullet[] | null>(null);

    useEffect(() => {
        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);

        const bulletsCollectionRef: CollectionReference<Bullet> = collection(userDocRef, `${type}s/${slug}/bullets`).withConverter(bulletConverter);
        const unsubscribe = onSnapshot(bulletsCollectionRef, (snapshot: QuerySnapshot<Bullet>) => {
            const bullets: Bullet[] = snapshot.docs.map((doc) => doc.data());
            setBullets(bullets);
        })

        return () => unsubscribe();
    }, [type, slug]);

    return bullets;
} 