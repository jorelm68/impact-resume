import styles from "@/styles/Admin.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import kebabCase from "lodash.kebabcase";
import { auth, firestore } from "@/lib/firebase";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, getDoc, setDoc } from "firebase/firestore";
import { resumeConverter, userConverter } from "@/lib/converters";
import { Resume, User } from "@/lib/types";
import toast from "react-hot-toast";
import AuthCheck from "@/components/AuthCheck";

export default function CreateResumePage() {
    const router = useRouter();
    const [resumeName, setResumeName] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(resumeName))

    // Validate length
    const isValid = resumeName.length > 3 && resumeName.length < 100;

    const createPost = async (e: any) => {
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
            fullName: user?.displayName || null,
            email: user?.email || null,
            linkedInURL: null,
            address: null,
            phone: null,
            displayAddress: false,
            displayPhone: false,
            education: [],
            experience: [],
        }

        await setDoc(ref, data);

        toast.success('Resume created!');

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    }

    return (
        <main>
            <AuthCheck>
                <form onSubmit={createPost}>
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
            </AuthCheck>
        </main>
    )
}