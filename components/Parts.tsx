import { useAdditional, useBullet, useBullets, useEducation, useExperience } from "@/lib/hooks"
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
        <View>
            <Part>
                <View style={{
                    display: 'flex',
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
            </Part>

            <View style={{
                paddingLeft: '1rem',
            }}>
                {education.bullets && education.bullets.length > 0 && education.bullets.map((bullet, index) => {
                    return (
                        <Bullet key={index} resume={resume} type='education' payload={slug} slug={bullet} />
                    )
                })}
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

function Bullet({ resume, type, payload, slug }: { resume: string, type: 'education' | 'experience' | 'additional', payload: string, slug: string }) {
    const bullet = useBullet(resume, type, payload, slug);

    if (!bullet) {
        return null;
    }


    return (
        <Part>
            <Text>{bullet.text}</Text>
        </Part>
    )
}

function Part({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '0.25rem 0',
            gap: '1rem',
        }}>
            <Checkbox />
            <Dots />
            {children}
        </View>
    )
}
