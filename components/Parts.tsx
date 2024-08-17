import { useAdditional, useEducation, useExperience } from "@/lib/hooks"
import { Additional, Education, Experience } from '@/lib/types'
import Text from "./Text";
import View from "./View";
import { formatTimestamp } from "@/lib/helper";
import { Timestamp } from "firebase/firestore";
import Dots from "./Dots";
import Checkbox from "./Checkbox";

export function EducationPart({ resume, slug }: { resume: string, slug: string | null }) {
    if (!slug) {
        return null;
    }

    const education: Education | null = useEducation(resume, slug);

    if (!education) {
        return null;
    }

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '0.5rem',
            gap: '1rem',
        }}>
            <Checkbox />

            <Dots />

            <View style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                flexGrow: 1,
            }}>
                <View style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                    }}>{education.school}</Text>
                    <Text style={{
                        fontWeight: 'bold',
                    }}>{education.location}</Text>
                </View>
                <Text style={{
                    fontWeight: 'bold',
                }}>{education.college}</Text>
                <Text>{education.degree}, {education.endDate instanceof Timestamp ? formatTimestamp(education.endDate) : ''}</Text>
            </View>
        </View>
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