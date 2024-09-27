// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, User as FirebaseUser, UserCredential } from "firebase/auth";
import { collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, getFirestore, QueryDocumentSnapshot, QuerySnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { bulletConverter, educationConverter, experienceConverter, projectConverter, resumeConverter, sectionConverter, userConverter } from "./converters";
import { Bullet, Education, Experience, Project, Resume, Section, User } from "./types";
import { getCheckoutUrl, getPortalUrl, getPremiumStatus } from "./stripePayment";
import constants from "./constants";
import toast from "react-hot-toast";

// Initialize Firebase
const app = initializeApp(constants.FIREBASE_CONFIG);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const serverTimestampValue = serverTimestamp()

export const upgradeToPremium = async (): Promise<string> => {
    const checkoutUrl = await getCheckoutUrl(app, constants.PRICE_ID);

    return checkoutUrl;
}

export const checkPremium = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    return await getPremiumStatus(app);
}

export const manageSubscription = async (): Promise<string> => {
    const portalUrl = await getPortalUrl(app);
    return portalUrl;
}


export const signInWithUmich = async (): Promise<void> => {
    const result: UserCredential = await signInWithPopup(auth, googleAuthProvider);
    const user: FirebaseUser = result.user;

    if (!user.email || !user.uid) {
        throw new Error('Google sign-in failed. Missing email or uid.');
    }

    // Set user details in the database
    const userRef: DocumentReference<User> = doc(firestore, 'users', user.uid).withConverter(userConverter);
    const userDoc: DocumentSnapshot<User> = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName ? user.displayName : user.email.split('@')[0],
            photoURL: user.photoURL ? user.photoURL : 'https://github.com/fireship-io/next-firebase-course/blob/main/public/hacker.png?raw=true',
        });
    }
}


export const getResumeDocRef = (uid: string, resume: string): DocumentReference<Resume> | null => {
    const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
    const userDocRef: DocumentReference<User> = doc(userCollectionRef, uid);
    const resumeCollectionRef: CollectionReference<Resume> = collection(userDocRef, 'resumes').withConverter(resumeConverter);
    const resumeDocRef: DocumentReference<Resume> = doc(resumeCollectionRef, resume);
    if (!resumeDocRef) return null;

    return resumeDocRef;
}
export const getExperienceDocRef = (resumeDocRef: DocumentReference<Resume>, slug: string): DocumentReference<Experience> | null => {
    const experienceCollection: CollectionReference<Experience> = collection(resumeDocRef, 'experiences').withConverter(experienceConverter);
    const experienceDocRef: DocumentReference<Experience> = doc(experienceCollection, slug);
    if (!experienceDocRef) return null;

    return experienceDocRef;
}
export const getProjectDocRef = (resumeDocRef: DocumentReference<Resume>, slug: string): DocumentReference<Project> | null => {
    const projectCollection: CollectionReference<Project> = collection(resumeDocRef, 'projects').withConverter(projectConverter);
    const projectDocRef: DocumentReference<Project> = doc(projectCollection, slug);
    if (!projectDocRef) return null;

    return projectDocRef;
}
export const getEducationDocRef = (resumeDocRef: DocumentReference<Resume>, slug: string): DocumentReference<Education> | null => {
    const educationCollection: CollectionReference<Education> = collection(resumeDocRef, 'educations').withConverter(educationConverter);
    const educationDocRef: DocumentReference<Education> = doc(educationCollection, slug);
    if (!educationDocRef) return null;

    return educationDocRef;
}
export const getSectionDocRef = (resumeDocRef: DocumentReference<Resume>, sectionName: string): DocumentReference<Section> | null => {
    const sectionCollection: CollectionReference<Section> = collection(resumeDocRef, 'sections').withConverter(sectionConverter);
    const sectionDocRef: DocumentReference<Section> = doc(sectionCollection, sectionName);
    if (!sectionDocRef) return null;

    return sectionDocRef;
}
export const getBulletDocRef = (docRef: DocumentReference<DocumentData>, slug: string): DocumentReference<Bullet> | null => {
    const bulletCollection: CollectionReference<Bullet> = collection(docRef, 'bullets').withConverter(bulletConverter);
    const bulletDocRef: DocumentReference<Bullet> = doc(bulletCollection, slug);
    if (!bulletDocRef) return null;

    return bulletDocRef;
}

export function generateSlug(): string {
    // Generate a unique document reference
    const collectionRef: CollectionReference<DocumentData> = collection(firestore, 'dummy-collection'); // Replace 'dummy-collection' with your collection
    const docRef: DocumentReference<DocumentData> = doc(collectionRef);
    const slug: string = docRef.id; // Get the unique ID

    // Format and return the slug
    return slug;
}

export async function createBullet(resume: Resume, resumeDocRef: DocumentReference<Resume>, data: DocumentData, docRef: DocumentReference<DocumentData>): Promise<void> {
    const bulletCollectionRef: CollectionReference<DocumentData> = collection(docRef, 'bullets');
    
    const slug = generateSlug();
    const newBulletRef: DocumentReference<Bullet> = doc(bulletCollectionRef, slug).withConverter(bulletConverter);
    await setDoc(newBulletRef, {
        slug,
        text: '',
    });

    await updateDoc(docRef, {
        bullets: [...data.bullets, newBulletRef.id],
    });

    await updateDoc(resumeDocRef, {
        selected: [...resume.selected, newBulletRef.id],
        updatedAt: serverTimestamp(),
    })
}

export async function createNewEducation(resumeDocRef: DocumentReference<Resume>): Promise<DocumentReference<Education>> {
    const educationDocRef: CollectionReference<Education> = collection(resumeDocRef, 'educations').withConverter(educationConverter);
    const slug = generateSlug();
    const newEducationRef: DocumentReference<Education> = doc(educationDocRef, slug);
    await setDoc(newEducationRef, {
        slug,
        school: null,
        location: null,
        college: null,
        degree: null,
        startDate: null,
        endDate: null,
        bullets: [],
    });

    return newEducationRef as DocumentReference<Education>;
}

export async function createNewExperience(resumeDocRef: DocumentReference<Resume>): Promise<DocumentReference<Experience>> {
    const educationDocRef: CollectionReference<Experience> = collection(resumeDocRef, 'experiences').withConverter(experienceConverter);
    const slug = generateSlug();
    const newExperienceRef: DocumentReference<Experience> = doc(educationDocRef, slug);
    await setDoc(newExperienceRef, {
        slug,
        title: null,
        organization: null,
        industry: null,
        function: null,
        startDate: null,
        endDate: null,
        location: null,
        workPhone: null,
        bullets: [],
    });

    return newExperienceRef as DocumentReference<Experience>;
}

export async function createNewProject(resumeDocRef: DocumentReference<Resume>): Promise<DocumentReference<Project>> {
    const projectDocRef: CollectionReference<Project> = collection(resumeDocRef, 'projects').withConverter(projectConverter);
    const slug = generateSlug();
    const newProjectRef: DocumentReference<Project> = doc(projectDocRef, slug);
    await setDoc(newProjectRef, {
        slug,
        name: null,
        link: null,
        github: null,
        github2: null,
        techStack: null,
        languages: null,
        industry: null,
        function: null,
        location: null,
        workPhone: null,
        bullets: [],
    });

    return newProjectRef as DocumentReference<Project>;
}

export async function toggleSelect(docRef: DocumentReference<Resume>, selection: string[], slug: string) {
    await updateDoc(docRef, {
        selected: selection.includes(slug) ? selection.filter((s) => s !== slug) : [...selection, slug],
        updatedAt: serverTimestamp(),
    });
}