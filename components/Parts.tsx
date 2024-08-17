import { useAdditional, useEducation, useExperience } from "@/lib/hooks"
import { Additional, Education, Experience } from '@/lib/types'

export function EducationPart({ resume, slug }: { resume: string, slug: string | null }) {
    if (!slug) {
        return null;
    }
    
    const education: Education | null = useEducation(resume, slug);

    return (
        <section>
            <h2>Education</h2>
        </section>
    )
}

export function ExperiencePart({ resume, slug}: { resume: string, slug: string | null }) {
    if (!slug) {
        return null;
    }
    
    const experience: Experience | null = useExperience(resume, slug);

    return (
        <section>
            <h2>Experience</h2>
        </section>
    )
}

export function AdditionalPart({ resume, slug }: { resume: string, slug: string | null }) {
    if (!slug) {
        return null;
    }

    const additional: Additional | null = useAdditional(resume, slug);

    return (
        <section>
            <h2>Additional</h2>
        </section>
    )
}