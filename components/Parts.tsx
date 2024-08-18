import { useAdditional, useBullet, useEducation, useExperience, useResume } from "@/lib/hooks"
import { AdditionalHook, BulletHook, Education, EducationHook, Experience, ExperienceHook, ResumeHook } from '@/lib/types'
import Text from "./Text";
import View from "./View";
import { formatTime } from "@/lib/helper";
import { serverTimestamp, updateDoc } from "firebase/firestore";
import React from "react";
import Editable from "./Editable";
import Wrapper from "./Layout/Wrapper";
import Section from "./Layout/Section";
import PlusButton from "./PlusButton";

export function ResumePart({ resumeSlug }: { resumeSlug: string }) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!resumeDocRef || !resume) {
        return null;
    }

    const handleSubmit = async (
        field: "fullName" | "email" | "linkedInURL" | "address" | "phone",
        newValue: string,
    ) => {
        await updateDoc(resumeDocRef, {
            [field]: newValue,
            updatedAt: serverTimestamp(),
        });
    };

    return (
        <Wrapper>
            <HeaderPart>
                <Editable label='Your Full Name' value={resume.fullName || ''} onSubmit={(newValue) => handleSubmit('fullName', newValue)} />
                <Editable label='Your Email' value={resume.email || ''} onSubmit={(newValue) => handleSubmit('email', newValue)} />
                <Editable label='Your LinkedIn URL' value={resume.linkedInURL || ''} onSubmit={(newValue) => handleSubmit('linkedInURL', newValue)} />
                <Editable label='Your Address' value={resume.address || ''} onSubmit={(newValue) => handleSubmit('address', newValue)} />
                <Editable label='Your Phone Number' value={resume.phone || ''} onSubmit={(newValue) => handleSubmit('phone', newValue)} />
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
            minWidth: '400px',
            flexGrow: 1,
        }}>
            {children}
        </View>
    )
}

export function EducationPart({ resumeSlug, educationSlug }: { resumeSlug: string, educationSlug: string }) {
    const { education }: EducationHook = useEducation(resumeSlug, educationSlug);

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

                <PlusButton />
            </Indent>
        </Wrapper>
    )
}

export function ExperiencePart({ resumeSlug, experienceSlug }: { resumeSlug: string, experienceSlug: string }) {
    const { experience }: ExperienceHook = useExperience(resumeSlug, experienceSlug);

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

                <PlusButton />
            </Indent>
        </Wrapper>
    )
}

export function AdditionalPart({ resumeSlug, additionalSlug }: { resumeSlug: string, additionalSlug: string }) {
    const { additional }: AdditionalHook = useAdditional(resumeSlug, additionalSlug);

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

            <PlusButton />
        </Wrapper>
    )
}

function Bullet({ resumeSlug, part, partSlug, bulletSlug }: { resumeSlug: string, part: 'education' | 'experience' | 'additional', partSlug: string, bulletSlug: string }) {
    const { bullet, bulletDocRef }: BulletHook = useBullet(resumeSlug, part, partSlug, bulletSlug);

    if (!bullet || !bulletDocRef) {
        return null;
    }

    const handleSubmit = async (newValue: string) => {
        updateDoc(bulletDocRef, {
            text: newValue,
        })
    };

    return (
        <Section>
            <Editable
                value={bullet.text}
                onSubmit={handleSubmit}
            />
        </Section>
    );
}

function EducationHeader({ education }: { education: Education }) {
    return (
        <>
            <View style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}>
                <Editable label='School' value={education.school || ''} onSubmit={(e) => { }} />
                <Text style={{
                    fontWeight: 'bold',
                }}>{education.location}</Text>
            </View>
            <Text style={{
                fontWeight: 'bold',
            }}>{education.college}</Text>
            <Text>{education.degree}, {formatTime(education.endDate, 'M, Y')}</Text>
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
            <Text>{formatTime(experience.startDate, 'M, Y')} - {formatTime(experience.endDate, 'M, Y')}</Text>
        </>
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