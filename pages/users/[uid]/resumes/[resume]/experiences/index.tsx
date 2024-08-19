import { auth } from "@/lib/firebase";
import { ExperiencesPageProps } from "@/lib/props";
import { Experience } from "@/lib/types";

export default function ExperiencesPage(props: ExperiencesPageProps) {
    const { resume } = props.params as { resume: string };

    return (
        <main>
            <h1>Experiences</h1>

            <ExperienceList resume={resume} />
        </main>
    )
}

function ExperienceList({ resume }: { resume: string }) {
    const experiences: Experience[] | null = useExperiences(resume);

    if (!experiences) return <p>Loading...</p>;

    return (
        <ul>
            {experiences.map((resume) => ExperienceItem(resume))}
        </ul>
    )
}

function ExperienceItem(experience: Experience) {
    return (
        <li key={experience.slug}>
            <a href={`/users/${auth.currentUser?.uid}/experiences/${experience.slug}`}>{experience.slug}</a>
        </li>
    )
}