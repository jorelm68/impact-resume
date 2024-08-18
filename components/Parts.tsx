import { useAdditional, useBullet, useEducation, useExperience, useResume } from "@/lib/hooks"
import { AdditionalHook, BulletHook, Education, EducationHook, Experience, ExperienceHook, ResumeHook, SubmitEducation, SubmitExperience, SubmitResume } from '@/lib/types'
import Text from "./Text";
import View from "./View";
import { formatTime } from "@/lib/helper";
import { Timestamp, updateDoc } from "firebase/firestore";
import React from "react";
import Editable, { EditableTimestamp } from "./Editable";
import Wrapper from "./Layout/Wrapper";
import Section from "./Layout/Section";
import PlusButton from "./PlusButton";

export function ResumePart({ resumeSlug, onSubmit }: { resumeSlug: string, onSubmit: SubmitResume }) {
    const { resume }: ResumeHook = useResume(resumeSlug);

    if (!resume) {
        return null;
    }

    return (
        <Wrapper>
            <HeaderPart>
                <Editable label='Your Full Name' separateLabel value={resume.fullName || ''} onSubmit={(newValue) => onSubmit('fullName', newValue)} />
                <Editable label='Your Email' separateLabel value={resume.email || ''} onSubmit={(newValue) => onSubmit('email', newValue)} />
                <Editable label='Your LinkedIn URL' separateLabel value={resume.linkedInURL || ''} onSubmit={(newValue) => onSubmit('linkedInURL', newValue)} />
                <Editable label='Your Address' separateLabel value={resume.address || ''} onSubmit={(newValue) => onSubmit('address', newValue)} />
                <Editable label='Your Phone Number' separateLabel value={resume.phone || ''} onSubmit={(newValue) => onSubmit('phone', newValue)} />
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
    const { education, educationDocRef }: EducationHook = useEducation(resumeSlug, educationSlug);

    if (!education || !educationDocRef) {
        return null;
    }

    const handleSubmit: SubmitEducation = async (field, newValue) => {
        updateDoc(educationDocRef, {
            [field]: newValue,
        })
    };

    return (
        <Wrapper>
            <Section>
                <View style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <Editable bold label='School' value={education.school || ''} onSubmit={(newValue: string) => handleSubmit('school', newValue)} />
                    <Editable bold label='Location' value={education.location || ''} onSubmit={(newValue: string) => handleSubmit('location', newValue)} />
                </View>
                <Editable bold label='College' value={education.college || ''} onSubmit={(newValue: string) => handleSubmit('college', newValue)} />

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <Editable label='Degree(s)' value={education.degree} onSubmit={(newValue: string) => handleSubmit('degree', newValue)} />
                        <Text style={{
                            paddingRight: '4px',
                        }}>,</Text>
                    <EditableTimestamp label='Graduation Date' value={education.endDate} onSubmit={(newValue: Timestamp | null) => handleSubmit('endDate', newValue)} />
                </View>
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
    const { experience, experienceDocRef }: ExperienceHook = useExperience(resumeSlug, experienceSlug);

    if (!experience || !experienceDocRef) {
        return null;
    }

    const handleSubmit: SubmitExperience = async (field, newValue) => {
        updateDoc(experienceDocRef, {
            [field]: newValue,
        })
    };

    return (
        <Wrapper>
            <Section>
                <View style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <Editable bold label='Organization' value={experience.organization || ''} onSubmit={(newValue: string) => handleSubmit('organization', newValue)} />
                    <Editable bold label='Location' value={experience.location || ''} onSubmit={(newValue: string) => handleSubmit('location', newValue)} />
                </View>
                <Editable bold label='Title' value={experience.title || ''} onSubmit={(newValue: string) => handleSubmit('title', newValue)} />

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                }}>
                    <EditableTimestamp label='Start Date' value={experience.startDate} onSubmit={(newValue: Timestamp | null) => handleSubmit('startDate', newValue)} />
                    <Text>-</Text>
                    <EditableTimestamp label='End Date' value={experience.endDate} onSubmit={(newValue: Timestamp | null) => handleSubmit('endDate', newValue)} />
                </View>
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


function Indent({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            paddingLeft: '1rem',
        }}>
            {children}
        </View>
    )
}