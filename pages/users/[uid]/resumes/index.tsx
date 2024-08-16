import { auth } from "@/lib/firebase";
import { useResumes } from "@/lib/hooks";
import { Resume } from "@/lib/types";

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
        <ul>
            {resumes.map((resume) => ResumeItem(resume))}
        </ul>
    )
}

function ResumeItem(resume: Resume) {
    return (
        <li key={resume.slug}>
            <a href={`/users/${auth.currentUser?.uid}/resumes/${resume.slug}`}>{resume.slug}</a>
        </li>
    )
}