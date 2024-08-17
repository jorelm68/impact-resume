import { auth } from "@/lib/firebase";
import { useEducations } from "@/lib/hooks";
import { EducationPageProps } from "@/lib/props";
import { Education } from "@/lib/types";

export default function EducationsPage(props: EducationPageProps) {
    const { resume } = props.params as { resume: string };

    return (
        <main>
            <h1>Educations</h1>

            <EducationList resume={resume} />
        </main>
    )
}

function EducationList({ resume }: { resume: string }) {
    const educations: Education[] | null = useEducations(resume);

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