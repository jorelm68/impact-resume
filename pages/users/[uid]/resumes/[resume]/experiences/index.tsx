import { auth } from "@/lib/firebase";
import { useExperiences } from "@/lib/hooks";
import { Experience } from "@/lib/types";

export default function ExperiencesPage() {
    return (
        <main>
            <h1>Experiences</h1>

            <ExperienceList />
        </main>
    )
}

function ExperienceList() {
    const experiences: Experience[] | null = useExperiences();

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