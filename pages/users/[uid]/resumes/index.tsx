import { auth } from "@/lib/firebase";
import { useResumes } from "@/lib/hooks";
import { Resume } from "@/lib/types";
import { User as FirebaseUser } from "firebase/auth";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";

export default function ResumesPage() {
    return (
        <main>
            <h1>Resumes</h1>

            <ResumeList />
        </main>
    )
}

function ResumeList() {
    const resumes: Resume[] | null = useResumes();

    if (!resumes) return <p>Loading...</p>;

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
                {resume.slug}
            </button>
        </Link>
    )
}