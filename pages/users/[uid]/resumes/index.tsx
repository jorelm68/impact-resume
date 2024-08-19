import { userConverter, resumeConverter } from "@/lib/converters";
import { auth, firestore, generateSlug, getResumeDocRef } from "@/lib/firebase";
import { useResumes } from "@/lib/hooks";
import { Resume, User } from "@/lib/types";
import { User as FirebaseUser } from "firebase/auth";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "@/styles/Admin.module.css";
import View from "@/components/View";

export default function ResumesPage() {
    return (
        <main>
            <h1>Resumes</h1>

            <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4rem',
            }}>
                <ResumeList />

                <CreateResume />
            </View>
        </main>
    )
}

function ResumeList() {
    const resumes: Resume[] | null = useResumes();

    if (!resumes) return <p>Loading...</p>;

    // Sort them by updatedAt
    resumes.sort((a, b) => {
        const aUpdatedAt = a.updatedAt instanceof Timestamp ? a.updatedAt.toMillis() : typeof a.updatedAt === 'number' ? a.updatedAt : 0;
        const bUpdatedAt = b.updatedAt instanceof Timestamp ? b.updatedAt.toMillis() : typeof b.updatedAt === 'number' ? b.updatedAt : 0;
        return bUpdatedAt - aUpdatedAt;
    });
    
    return (
        <section>
            {resumes.map((resume, index) => <ResumeItem key={index} resume={resume} />)}
        </section>
    )
}

function ResumeItem({ resume }: { resume: Resume }) {
    return (
        <Link href={`/users/${auth.currentUser?.uid}/resumes/${resume.slug}`}>
            <button>
                {resume.resumeName}
            </button>
        </Link>
    )
}

function CreateResume() {
    const router = useRouter();
    const [resumeName, setResumeName] = useState('');

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

        const slug = generateSlug();
        const ref: DocumentReference<Resume> = doc(resumeCollectionRef, slug);

        const user: User | undefined = await getDoc(userDocRef).then((doc: DocumentSnapshot<User>) => doc.data());

        // Tip: give all fields a default value here
        const data: Resume = {
            slug,
            resumeName,
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
            selected: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }

        await setDoc(ref, data);

        toast.success('Resume created!');

        // Imperative navigation after doc is set
        router.push(`/${auth.currentUser?.uid}/resumes/${slug}`);
    }

    return (
        <form onSubmit={createResume} style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
        }}>
            <input
                style={{
                    width: '50%',
                    minWidth: '400px',
                }}
                value={resumeName}
                onChange={(e: any) => setResumeName(e.target.value)}
                placeholder="Resume Name"
            />

            <button type='submit' disabled={!isValid} className='btn-green' style={{
                margin: '0px',
            }}>
                Create New Resume
            </button>
        </form>
    )
}