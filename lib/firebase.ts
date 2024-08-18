// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, User as FirebaseUser, UserCredential } from "firebase/auth";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { resumeConverter, userConverter } from "./converters";
import { Resume, User } from "./types";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBlduTuBPlAyZHD_H-p1q63EtpjidNuU10",
    authDomain: "dorm-tools.firebaseapp.com",
    projectId: "dorm-tools",
    storageBucket: "dorm-tools.appspot.com",
    messagingSenderId: "998532745943",
    appId: "1:998532745943:web:88136a61fa3b1a02983e92",
    measurementId: "G-XXCV8CGZ2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const serverTimestampValue = serverTimestamp()


export const signInWithUmich = async () => {
    const result: UserCredential = await signInWithPopup(auth, googleAuthProvider);
    const user: FirebaseUser = result.user;

    if (!user.email || !user.uid) {
        throw new Error('Google sign-in failed. Missing email or uid.');
    }

    if (!user.email.endsWith('@umich.edu')) {
        throw new Error('Google sign-in failed. Only umich.edu emails are allowed.');
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

export const getResumeDocRef = async (uid: string | undefined, resume: string): Promise<DocumentReference<Resume> | null> => {
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