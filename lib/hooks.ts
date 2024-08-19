import { useEffect, useState } from "react";
import { Bullet, BulletHook, Education, EducationHook, Experience, ExperienceHook, Resume, User, UserHook } from "./types";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { auth, checkPremium, firestore, getResumeDocRef } from "./firebase";
import { User as FirebaseUser } from 'firebase/auth';
import { bulletConverter, educationConverter, experienceConverter, resumeConverter, userConverter } from "./converters";
import toast from "react-hot-toast";

export function useUser(): UserHook {
    const [user, setUser] = useState<User | null>(null);
    const [userDocRef, setUserDocRef] = useState<DocumentReference<User> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser) return;

        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, firebaseUser.uid);
        setUserDocRef(userDocRef);

        const unsubscribe = onSnapshot(userDocRef, (snapshot: DocumentSnapshot<User>) => {
            const user: User | undefined = snapshot.data();
            if (!user) return;
            setUser(user);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    return { user, userDocRef };
}

export function useResumes() {
    const [resumes, setResumes] = useState<Resume[] | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser) return;

        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, firebaseUser.uid);
        const resumeCollectionRef: CollectionReference<Resume> = collection(userDocRef, 'resumes').withConverter(resumeConverter);

        const unsubscribe = onSnapshot(resumeCollectionRef, (snapshot: QuerySnapshot<Resume>) => {
            const resumes: Resume[] = snapshot.docs.map((doc) => doc.data());
            setResumes(resumes);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    return resumes;
}

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
        setEducationDocRef(educationDocRef);

        const unsubscribe = onSnapshot(educationDocRef, (snapshot: DocumentSnapshot<Education>) => {
            const education: Education | undefined = snapshot.data();
            if (!education) return;
            setEducation(education);
        })

        return () => unsubscribe();
    }, [slug, auth.currentUser]);

    return { education, educationDocRef };
}

export function useBullet(resume: string, docRef: DocumentReference<Experience | Resume | Education>, slug: string): BulletHook {
    const [bullet, setBullet] = useState<Bullet | null>(null);
    const [bulletDocRef, setBulletDocRef] = useState<DocumentReference<Bullet> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resume);
        if (!resumeDocRef) return;

        const bulletCollectionRef: CollectionReference<Bullet> = collection(docRef, 'bullets').withConverter(bulletConverter);
        const bulletDocRef: DocumentReference<Bullet> = doc(bulletCollectionRef, slug);
        setBulletDocRef(bulletDocRef);

        const unsubscribe = onSnapshot(bulletDocRef, (snapshot: DocumentSnapshot<Bullet>) => {
            const bullet: Bullet | undefined = snapshot.data();
            if (!bullet) return;
            setBullet(bullet);
        })

        return () => unsubscribe();
    }, [slug, auth.currentUser]);

    return { bullet, bulletDocRef };
}


export function usePremiumStatus(): boolean {
    const [isPremium, setIsPremium] = useState<boolean>(false);

    useEffect(() => {
        checkPremium().then((premiumStatus: boolean) => {
            setIsPremium(premiumStatus);
        }).catch((error: any) => {
            toast.error(error.message);
        })
    }, [auth.currentUser?.uid]);

    return isPremium;
}