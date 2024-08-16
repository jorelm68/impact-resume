import { auth } from "@/lib/firebase";
import { useResumes } from "@/lib/hooks";

export default function ResumesPage() {
    return (
        <main>
            <h1>Resumes</h1>

            <ResumeList />
        </main>
    )
}

function ResumeList() {
    const resumes = useResumes();

    if (!resumes) return <p>Loading...</p>;

    return (
        <ul>
            {resumes.map((resume) => (
                <li key={resume.slug}>
                    <a href={`/users/${auth.currentUser?.uid}/resumes/${resume.slug}`}>{resume.slug}</a>
                </li>
            ))}
        </ul>
    )
}