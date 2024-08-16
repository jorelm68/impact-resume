import { auth } from "@/lib/firebase";
import { useEducations } from "@/lib/hooks";
import { Education } from "@/lib/types";

export default function EducationsPage() {
    return (
        <main>
            <h1>Educations</h1>

            <EducationList />
        </main>
    )
}

function EducationList() {
    const educations: Education[] | null = useEducations();

    if (!educations) return <p>Loading...</p>;

    return (
        <ul>
            {educations.map((resume) => EducationItem(resume))}
        </ul>
    )
}

function EducationItem(education: Education) {
    return (
        <li key={education.slug}>
            <a href={`/users/${auth.currentUser?.uid}/educations/${education.slug}`}>{education.slug}</a>
        </li>
    )
}