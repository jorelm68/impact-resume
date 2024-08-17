import { useAdditional, useEducation, useExperience } from "@/lib/hooks"
import { Additional, Education, Experience } from '@/lib/types'
import Text from "./Text";
import View from "./View";

export function EducationPart({ resume, slug }: { resume: string, slug: string | null }) {
    if (!slug) {
        return null;
    }

    const education: Education | null = useEducation(resume, slug);

    if (!education) {
        return null;
    }

    return (
        <section>
            <View style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
            }}>
                <Text>{education.school}</Text>
                <Text>{education.college}</Text>
                <Text>{education.degree}</Text>
            </View>
        </section>
    )
}

export function ExperiencePart({ resume, slug }: { resume: string, slug: string | null }) {
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