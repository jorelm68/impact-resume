// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, User as FirebaseUser, UserCredential } from "firebase/auth";
import { collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { bulletConverter, educationConverter, experienceConverter, resumeConverter, userConverter } from "./converters";
import { Bullet, Education, Experience, Resume, User } from "./types";
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


export const getResumeDocRef = (uid: string | undefined, resume: string): DocumentReference<Resume> | null => {
    if (!uid) {
        return null;
    }

    const userCollection: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
    const userDocRef: DocumentReference<User> = doc(userCollection, uid);
    const resumeCollection: CollectionReference<Resume> = collection(userDocRef, 'resumes').withConverter(resumeConverter);
    const resumeDocRef: DocumentReference<Resume> = doc(resumeCollection, resume);

    if (!resumeDocRef) {
        return null;
    }

    return resumeDocRef;
}

export function generateSlug(): string {
    // Generate a unique document reference
    const collectionRef: CollectionReference<DocumentData> = collection(firestore, 'dummy-collection'); // Replace 'dummy-collection' with your collection
    const docRef: DocumentReference<DocumentData> = doc(collectionRef);
    const slug: string = docRef.id; // Get the unique ID

    // Format and return the slug
    return slug;
}

export async function createBullet(docRef: DocumentReference<DocumentData>): Promise<DocumentReference<Bullet>> {
    const bulletCollectionRef: CollectionReference<DocumentData> = collection(docRef, 'bullets');
    const slug = generateSlug();
    const newBulletRef: DocumentReference<Bullet> = doc(bulletCollectionRef, slug).withConverter(bulletConverter);
    await setDoc(newBulletRef, {
        slug,
        text: '',
    });

    return newBulletRef as DocumentReference<Bullet>;
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