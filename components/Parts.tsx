import { useAdditional, useBullet, useBullets, useEducation, useExperience, useResume } from "@/lib/hooks"
import { Additional, Education, Experience, Resume } from '@/lib/types'
import Text from "./Text";
import View from "./View";
import { formatTimestamp } from "@/lib/helper";
import { DocumentReference, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import Dots from "./Dots";
import Checkbox from "./Checkbox";
import React from "react";
import { auth, getResumeDocRef } from "@/lib/firebase";

export function ResumePart({ resumeSlug }: { resumeSlug: string }) {
    const { resume, resumeDocRef } = useResume(resumeSlug);

    if (!resumeDocRef || !resume) {
        return null;
    }

    const handleChangeFullName = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await updateDoc(resumeDocRef, {
            fullName: event.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    const handleChangeEmail = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await updateDoc(resumeDocRef, {
            email: event.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    const handleChangeLinkedInURL = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await updateDoc(resumeDocRef, {
            linkedInURL: event.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    const handleChangeAddress = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await updateDoc(resumeDocRef, {
            address: event.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    const handleChangePhone = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await updateDoc(resumeDocRef, {
            phone: event.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    return (
        <Wrapper>
            <HeaderPart>
                <TextInput label='Your Full Name' placeholder='Full Name' value={resume.fullName || ''} onChange={handleChangeFullName} />
                <TextInput label='Your Email' placeholder='Email' value={resume.email || ''} onChange={handleChangeEmail} />
                <TextInput label='LinkedIn URL' placeholder='LinkedIn URL' value={resume.linkedInURL || ''} onChange={handleChangeLinkedInURL} />
                <TextInput label='Address' placeholder='Address' value={resume.address || ''} onChange={handleChangeAddress} />
                <TextInput label='Phone' placeholder='Phone' value={resume.phone || ''} onChange={handleChangePhone} />
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
        }}>
            {children}
        </View>
    )
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

function TextInput({ label, ...rest }: TextInputProps) {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
        }}>
            <Text>{label}</Text>
            <input
                {...rest}
                type="text"
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

export function EducationPart({ resumeSlug, educationSlug }: { resumeSlug: string, educationSlug: string }) {
    const education: Education | null = useEducation(resumeSlug, educationSlug);

    if (!education) {
        return null;
    }

    return (
        <Wrapper>
            <Section>
                <EducationHeader education={education} />
            </Section>

            <Indent>
                {education.bullets && education.bullets.length > 0 && education.bullets.map((bulletSlug, index) => {
                    return (
                        <Bullet key={index} resumeSlug={resumeSlug} part='education' partSlug={educationSlug} bulletSlug={bulletSlug} />
                    )
                })}
            </Indent>
        </Wrapper>
    )
}

export function ExperiencePart({ resumeSlug, experienceSlug }: { resumeSlug: string, experienceSlug: string }) {
    const experience: Experience | null = useExperience(resumeSlug, experienceSlug);

    if (!experience) {
        return null;
    }

    return (
        <Wrapper>
            <Section>
                <ExperienceHeader experience={experience} />
            </Section>

            <Indent>
                {experience.bullets && experience.bullets.length > 0 && experience.bullets.map((bulletSlug, index) => {
                    return (
                        <Bullet key={index} resumeSlug={resumeSlug} part='experience' partSlug={experienceSlug} bulletSlug={bulletSlug} />
                    )
                })}
            </Indent>
        </Wrapper>
    )
}

export function AdditionalPart({ resumeSlug, additionalSlug }: { resumeSlug: string, additionalSlug: string }) {
    const additional: Additional | null = useAdditional(resumeSlug, additionalSlug);

    if (!additional) {
        return null;
    }

    return (
        <Wrapper>
            {additional.bullets && additional.bullets.length > 0 && additional.bullets.map((bulletSlug, index) => {
                return (
                    <Bullet key={index} resumeSlug={resumeSlug} part='additional' partSlug={additionalSlug} bulletSlug={bulletSlug} />
                )
            })}
        </Wrapper>
    )
}

function Bullet({ resumeSlug, part, partSlug, bulletSlug }: { resumeSlug: string, part: 'education' | 'experience' | 'additional', partSlug: string, bulletSlug: string }) {
    const bullet = useBullet(resumeSlug, part, partSlug, bulletSlug);

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
            padding: '16px',
            minWidth: `${400 + 32}px`,
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