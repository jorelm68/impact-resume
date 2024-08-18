import { useAdditional, useBullet, useEducation, useExperience, useResume } from "@/lib/hooks"
import { Additional, AdditionalHook, BulletHook, Education, EducationHook, Experience, ExperienceHook, Resume, ResumeHook } from '@/lib/types'
import Text from "./Text";
import View from "./View";
import { formatTime } from "@/lib/helper";
import { DocumentReference, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import Dots from "./Dots";
import Checkbox from "./Checkbox";
import React, { useState } from "react";
import { auth, getResumeDocRef } from "@/lib/firebase";
import { TextInputProps } from "@/lib/props";
import Editable from "./Editable";

export function ResumePart({ resumeSlug }: { resumeSlug: string }) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!resumeDocRef || !resume) {
        return null;
    }

    const handleChangeFullName = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        await updateDoc(resumeDocRef, {
            fullName: e.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    const handleChangeEmail = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        await updateDoc(resumeDocRef, {
            email: e.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    const handleChangeLinkedInURL = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        await updateDoc(resumeDocRef, {
            linkedInURL: e.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    const handleChangeAddress = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        await updateDoc(resumeDocRef, {
            address: e.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    const handleChangePhone = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        await updateDoc(resumeDocRef, {
            phone: e.target.value,
            updatedAt: serverTimestamp(),
        });
    }

    return (
        <Wrapper>
            <HeaderPart>
                <Editable label='Your Full Name' value={resume.fullName || ''} onChange={handleChangeFullName} />
                <Editable label='Your Email' value={resume.email || ''} onChange={handleChangeEmail} />
                <Editable label='Your LinkedIn URL' value={resume.linkedInURL || ''} onChange={handleChangeLinkedInURL} />
                <Editable label='Your Address' value={resume.address || ''} onChange={handleChangeAddress} />
                <Editable label='Your Phone Number' value={resume.phone || ''} onChange={handleChangePhone} />
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
        </Wrapper>
    )
}

function Bullet({ resumeSlug, part, partSlug, bulletSlug }: { resumeSlug: string, part: 'education' | 'experience' | 'additional', partSlug: string, bulletSlug: string }) {
    const { bullet, bulletDocRef }: BulletHook = useBullet(resumeSlug, part, partSlug, bulletSlug);

    if (!bullet || !bulletDocRef) {
        return null;
    }

    const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateDoc(bulletDocRef, {
            text: e.target.value,
        })
    };

    return (
        <Section>
            <Editable 
                value={bullet.text}
                onChange={handleTextChange}
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