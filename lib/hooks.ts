import { useEffect, useState } from "react";
import { Bullet, BulletHook, Education, EducationHook, Experience, ExperienceHook, Resume, Section, SectionHook, User, UserHook } from "./types";
import { collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { auth, checkPremium, firestore, getBulletDocRef, getEducationDocRef, getExperienceDocRef, getResumeDocRef } from "./firebase";
import { User as FirebaseUser } from 'firebase/auth';
import { sectionConverter, resumeConverter, userConverter } from "./converters";
import toast from "react-hot-toast";

export function useUser(): UserHook {
    const [user, setUser] = useState<User | null>(null);
    const [userDocRef, setUserDocRef] = useState<DocumentReference<User> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser || !firebaseUser.uid) return;

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

export function useResume(resumeSlug: string) {
    const [resume, setResume] = useState<Resume | null>(null);
    const [resumeDocRef, setResumeDocRef] = useState<DocumentReference<Resume> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser || !firebaseUser.uid) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resumeSlug);
        if (!resumeDocRef) return;
        setResumeDocRef(resumeDocRef);

        const unsubscribe = onSnapshot(resumeDocRef, (snapshot: DocumentSnapshot<Resume>) => {
            const resume: Resume | undefined = snapshot.data();
            if (!resume) return;
            setResume(resume);
        })

        return () => unsubscribe();
    }, [resumeSlug, auth.currentUser]);

    return { resume, resumeDocRef };
}
export function useResumes(): Resume[] {
    const [resumes, setResumes] = useState<Resume[]>([]);

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

export function useEducation(resumeSlug: string, educationSlug: string): EducationHook {
    const [education, setEducation] = useState<Education | null>(null);
    const [educationDocRef, setEducationDocRef] = useState<DocumentReference<Education> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser || !firebaseUser.uid) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resumeSlug);
        if (!resumeDocRef) return;

        const educationDocRef: DocumentReference<Education> | null = getEducationDocRef(resumeDocRef, educationSlug);
        if (!educationDocRef) return;
        setEducationDocRef(educationDocRef);

        const unsubscribe = onSnapshot(educationDocRef, (snapshot: DocumentSnapshot<Education>) => {
            const education: Education | undefined = snapshot.data();
            if (!education) return;
            setEducation(education);
        })

        return () => unsubscribe();
    }, [resumeSlug, educationSlug, auth.currentUser]);

    return { education, educationDocRef };
}

export function useExperience(resumeSlug: string, experienceSlug: string): ExperienceHook {
    const [experience, setExperience] = useState<Experience | null>(null);
    const [experienceDocRef, setExperienceDocRef] = useState<DocumentReference<Experience> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser || !firebaseUser.uid) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resumeSlug);
        if (!resumeDocRef) return;

        const experienceDocRef: DocumentReference<Experience> | null = getExperienceDocRef(resumeDocRef, experienceSlug);
        if (!experienceDocRef) return;
        setExperienceDocRef(experienceDocRef);

        const unsubscribe = onSnapshot(experienceDocRef, (snapshot: DocumentSnapshot<Experience>) => {
            const experience: Experience | undefined = snapshot.data();
            if (!experience) return;
            setExperience(experience);
        })

        return () => unsubscribe();
    }, [resumeSlug, experienceSlug, auth.currentUser]);

    return { experience, experienceDocRef };
}

export function useSection(resumeSlug: string, sectionSlug: string): SectionHook {
    const [section, setSection] = useState<Section | null>(null);
    const [sectionDocRef, setSectionDocRef] = useState<DocumentReference<Section> | null>(null);

    useEffect(() => {
        const firebaseUser: FirebaseUser | null = auth.currentUser;
        if (!firebaseUser || !firebaseUser.uid) return;

        const resumeDocRef: DocumentReference<Resume> | null = getResumeDocRef(firebaseUser.uid, resumeSlug);
        if (!resumeDocRef) return;

        const sectionCollectionRef: CollectionReference<Section> = collection(resumeDocRef, 'sections').withConverter(sectionConverter);
        const sectionDocRef: DocumentReference<Section> = doc(sectionCollectionRef, sectionSlug);
        setSectionDocRef(sectionDocRef);

        const unsubscribe = onSnapshot(sectionDocRef, (snapshot: DocumentSnapshot<Section>) => {
            const section: Section | undefined = snapshot.data();
            if (!section) return;
            setSection(section);
        })

        return () => unsubscribe();
    }, [resumeSlug, sectionSlug, auth.currentUser])

    return { section, sectionDocRef };
}

export function useBullet(docRef: DocumentReference<DocumentData>, bulletSlug: string): BulletHook {
    const [bullet, setBullet] = useState<Bullet | null>(null);
    const [bulletDocRef, setBulletDocRef] = useState<DocumentReference<Bullet> | null>(null);

    useEffect(() => {
        const bulletDocRef: DocumentReference<Bullet> | null = getBulletDocRef(docRef, bulletSlug);
        if (!bulletDocRef) return;
        setBulletDocRef(bulletDocRef);

        const unsubscribe = onSnapshot(bulletDocRef, (snapshot: DocumentSnapshot<Bullet>) => {
            const bullet: Bullet | undefined = snapshot.data();
            if (!bullet) return;
            setBullet(bullet);
        })

        return () => unsubscribe();
    }, [bulletSlug, auth.currentUser]);

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