import { useAdditional, useBullet, useBullets, useEducation, useExperience, useResume } from "@/lib/hooks"
import { Additional, Education, Experience, Resume } from '@/lib/types'
import Text from "./Text";
import View from "./View";
import { formatTimestamp } from "@/lib/helper";
import { Timestamp } from "firebase/firestore";
import Dots from "./Dots";
import Checkbox from "./Checkbox";

export function ResumePart({ resume }: { resume: Resume }) {
    return (
        <Wrapper>
            <HeaderPart>
                <TextInput label='Your Full Name' placeholder='Full Name' />
                <TextInput label='Your Email' placeholder='Email' />
                <TextInput label='LinkedIn URL' placeholder='LinkedIn URL' />
            </HeaderPart>
        </Wrapper>
    )
}

function HeaderPart({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            whiteSpace: 'nowrap',
            width: '400px',
            backgroundColor: 'green',
        }}>
            {children}
        </View>
    )
}

function TextInput({ label, placeholder }: { label: string, placeholder?: string }) {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            whiteSpace: 'nowrap',
        }}>
            <Text>{label}</Text>
            <input
                type="text"
                placeholder={placeholder}
                style={{
                    width: '256px',
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '0.25rem',
                }}
            />
        </View>
    )
}

export function EducationPart({ resume, slug }: { resume: string, slug: string | null }) {
    if (!slug) {
        return null;
    }

    const education: Education | null = useEducation(resume, slug);

    if (!education) {
        return null;
    }

    return (
        <Wrapper>
            <Section>
                <EducationHeader education={education} />
            </Section>

            <Indent>
                {education.bullets && education.bullets.length > 0 && education.bullets.map((bullet, index) => {
                    return (
                        <Bullet key={index} resume={resume} type='education' payload={slug} slug={bullet} />
                    )
                })}
            </Indent>
        </Wrapper>
    )
}

export function ExperiencePart({ resume, slug }: { resume: string, slug: string | null }) {
    if (!slug) {
        return null;
    }

    const experience: Experience | null = useExperience(resume, slug);

    if (!experience) {
        return null;
    }

    return (
        <Wrapper>
            <Section>
                <ExperienceHeader experience={experience} />
            </Section>

            <Indent>
                {experience.bullets && experience.bullets.length > 0 && experience.bullets.map((bullet, index) => {
                    return (
                        <Bullet key={index} resume={resume} type='experience' payload={slug} slug={bullet} />
                    )
                })}
            </Indent>
        </Wrapper>
    )
}

export function AdditionalPart({ resume, slug }: { resume: string, slug: string | null }) {
    if (!slug) {
        return null;
    }

    const additional: Additional | null = useAdditional(resume, slug);

    if (!additional) {
        return null;
    }

    return (
        <Wrapper>
            {additional.bullets && additional.bullets.length > 0 && additional.bullets.map((bullet, index) => {
                return (
                    <Bullet key={index} resume={resume} type='additional' payload={slug} slug={bullet} />
                )
            })}
        </Wrapper>
    )
}

function Bullet({ resume, type, payload, slug }: { resume: string, type: 'education' | 'experience' | 'additional', payload: string, slug: string }) {
    const bullet = useBullet(resume, type, payload, slug);

    if (!bullet) {
        return null;
    }


    return (
        <Section>
            <Text>{bullet.text}</Text>
        </Section>
    )
}

function EducationHeader({ education }: { education: Education }) {
    return (
        <>
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
        </>
    )
}

function ExperienceHeader({ experience }: { experience: Experience }) {
    return (
        <>
            <View style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}>
                <Text style={{
                    fontWeight: 'bold',
                }}>{experience.organization}</Text>
                <Text style={{
                    fontWeight: 'bold',
                }}>{experience.location}</Text>
            </View>
            <Text style={{
                fontWeight: 'bold',
            }}>{experience.title}</Text>
            <Text>{experience.startDate instanceof Timestamp ? formatTimestamp(experience.startDate) : ''} - {experience.endDate instanceof Timestamp ? formatTimestamp(experience.endDate) : ''}</Text>
        </>
    )
}

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            padding: '8px',
            minWidth: `${400 + 16}px`,
        }}>
            {children}
        </View>
    )
}

function Section({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '4px 0px',
            gap: '24px',
            width: '100%',
        }}>
            <Checkbox />
            <Dots />
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'space-between',
            }}>
                {children}
            </View>
        </View>
    )
}

function Indent({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            paddingLeft: '1rem',
        }}>
            {children}
        </View>
    )
}