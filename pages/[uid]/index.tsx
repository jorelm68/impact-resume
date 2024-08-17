import styles from '@/styles/Admin.module.css';
import AuthCheck from "@/components/AuthCheck";
import ResumeFeed from "@/components/ResumeFeed";
import { resumeConverter, userConverter } from "@/lib/converters";
import { auth, firestore } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Resume, User } from "@/lib/types";
import { Query, query, orderBy, collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResumesPage() {
    return (
        <main>
            <AuthCheck>
                <ResumeList />
                <CreateResume />
            </AuthCheck>
        </main>
    )
}

function ResumeList() {
    const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
    const userDocRef: DocumentReference<User> = doc(userCollectionRef, auth.currentUser?.uid);
    const resumeCollectionRef: CollectionReference<Resume> = collection(userDocRef, 'resumes').withConverter(resumeConverter);
    const queryInstance: Query<Resume> = query(resumeCollectionRef, orderBy('updatedAt'));

    const [querySnapshot] = useCollection(queryInstance);

    const resumes: Resume[] = querySnapshot?.docs.map(doc => doc.data()) || [];

    return <ResumeFeed resumes={resumes} />
}

function CreateResume() {
    const router = useRouter();
    const [resumeName, setResumeName] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(resumeName))

    // Validate length
    const isValid = resumeName.length > 3 && resumeName.length < 100;

    const createResume = async (e: any) => {
        e.preventDefault();
        const uid = auth.currentUser?.uid;

        if (!uid) {
            return;
        }

        const userCollectionRef: CollectionReference<User> = collection(firestore, 'users').withConverter(userConverter);
        const userDocRef: DocumentReference<User> = doc(userCollectionRef, uid);
        const resumeCollectionRef: CollectionReference<Resume> = collection(userDocRef, 'resumes').withConverter(resumeConverter);

        const ref: DocumentReference<Resume> = doc(resumeCollectionRef, slug);

        const user: User | undefined = await getDoc(userDocRef).then((doc: DocumentSnapshot<User>) => doc.data());

        // Tip: give all fields a default value here
        const data: Resume = {
            slug,
            fullName: user?.displayName || null,
            email: user?.email || null,
            linkedInURL: null,
            address: null,
            phone: null,
            displayAddress: false,
            displayPhone: false,
            educations: [],
            experiences: [],
            additionals: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }

        await setDoc(ref, data);

        toast.success('Resume created!');

        // Imperative navigation after doc is set
        router.push(`/${auth.currentUser?.uid}/${slug}`);
    }

    return (
        <form onSubmit={createResume}>
            <input
                value={resumeName}
                onChange={(e: any) => setResumeName(e.target.value)}
                placeholder="My New Resume!"
                className={styles.input}
            />

            <p>
                <strong>Slug:</strong> {slug}
            </p>

            <button type='submit' disabled={!isValid} className='btn-green'>
                Create New Resume
            </button>
        </form>
    )
}