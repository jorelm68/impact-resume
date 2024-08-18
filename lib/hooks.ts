import { useEffect, useState } from "react";
import { Additional, AdditionalHook, Bullet, BulletHook, Education, EducationHook, Experience, ExperienceHook, Resume, User } from "./types";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { auth, firestore, getResumeDocRef } from "./firebase";
import { User as FirebaseUser } from 'firebase/auth';
import { additionalConverter, bulletConverter, educationConverter, experienceConverter, resumeConverter, userConverter } from "./converters";

export function useResume(slug: string) {
    const [resume, setResume] = useState<Resume | null>(null);
    const [resumeDocRef, setResumeDocRef] = useState<DocumentReference<Resume> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, slug);
        if (!resumeDocRef) return;

        setResumeDocRef(resumeDocRef);

        const unsubscribe = onSnapshot(resumeDocRef, (snapshot: DocumentSnapshot<Resume>) => {
            const resume: Resume | undefined = snapshot.data();
            if (!resume) return;
            setResume(resume);
        })

        return () => unsubscribe();
    }, [slug, auth.currentUser]);

    return { resume, resumeDocRef };
}

export function useExperience(resume: string, slug: string): ExperienceHook {
    const [experience, setExperience] = useState<Experience | null>(null);
    const [experienceDocRef, setExperienceDocRef] = useState<DocumentReference<Experience> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resume);
        if (!resumeDocRef) return;

        const experienceCollectionRef: CollectionReference<Experience> = collection(resumeDocRef, 'experiences').withConverter(experienceConverter);
        const experienceDocRef: DocumentReference<Experience> = doc(experienceCollectionRef, slug);
        setExperienceDocRef(experienceDocRef);

        const unsubscribe = onSnapshot(experienceDocRef, (snapshot: DocumentSnapshot<Experience>) => {
            const experience: Experience | undefined = snapshot.data();
            if (!experience) return;
            setExperience(experience);
        })

        return () => unsubscribe();
    }, [slug, auth.currentUser]);

    return { experience, experienceDocRef };
}

export function useEducation(resume: string, slug: string): EducationHook {
    const [education, setEducation] = useState<Education | null>(null);
    const [educationDocRef, setEducationDocRef] = useState<DocumentReference<Education> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resume);
        if (!resumeDocRef) return;

        const educationCollectionRef: CollectionReference<Education> = collection(resumeDocRef, 'educations').withConverter(educationConverter);
        const educationDocRef: DocumentReference<Education> = doc(educationCollectionRef, slug);
        const unsubscribe = onSnapshot(educationDocRef, (snapshot: DocumentSnapshot<Education>) => {
            const education: Education | undefined = snapshot.data();
            if (!education) return;
            setEducation(education);
        })

        return () => unsubscribe();
    }, [slug, auth.currentUser]);

    return { education, educationDocRef };
}

export function useAdditional(resume: string, slug: string): AdditionalHook {
    const [additional, setAdditional] = useState<Additional | null>(null);
    const [additionalDocRef, setAdditionalDocRef] = useState<DocumentReference<Additional> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resume);
        if (!resumeDocRef) return;

        const additionalCollectionRef: CollectionReference<Additional> = collection(resumeDocRef, 'additionals').withConverter(additionalConverter);
        const additionalDocRef: DocumentReference<Additional> = doc(additionalCollectionRef, slug);
        setAdditionalDocRef(additionalDocRef);

        const unsubscribe = onSnapshot(additionalDocRef, (snapshot: DocumentSnapshot<Additional>) => {
            const additional: Additional | undefined = snapshot.data();
            if (!additional) return;
            setAdditional(additional);
        })

        return () => unsubscribe();
    }, [slug, auth.currentUser]);

    return { additional, additionalDocRef };
}

export function useBullet<T>(resume: string, type: 'additional' | 'experience' | 'education', payload: string, slug: string): BulletHook {
    const [bullet, setBullet] = useState<Bullet | null>(null);
    const [bulletDocRef, setBulletDocRef] = useState<DocumentReference<Bullet> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resume);
        if (!resumeDocRef) return;

        const typeCollectionRef: CollectionReference<Additional | Education | Experience> = collection(resumeDocRef, `${type}s`).withConverter(type === 'additional' ? additionalConverter : type === 'experience' ? experienceConverter : educationConverter);
        const typeDocRef: DocumentReference<Additional | Education | Experience> = doc(typeCollectionRef, payload);
        const bulletCollectionRef: CollectionReference<Bullet> = collection(typeDocRef, 'bullets').withConverter(bulletConverter);
        const bulletDocRef: DocumentReference<Bullet> = doc(bulletCollectionRef, slug);
        setBulletDocRef(bulletDocRef);

        const unsubscribe = onSnapshot(bulletDocRef, (snapshot: DocumentSnapshot<Bullet>) => {
            const bullet: Bullet | undefined = snapshot.data();
            if (!bullet) return;
            setBullet(bullet);
        })

        return () => unsubscribe();
    }, [type, slug, auth.currentUser]);

    return { bullet, bulletDocRef };
}