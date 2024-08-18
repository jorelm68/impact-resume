import { useAdditional, useBullet, useEducation, useExperience, useResume } from "@/lib/hooks"
import { Additional, AdditionalHook, Bullet, BulletHook, Education, EducationHook, Experience, ExperienceHook, ResumeHook, SubmitEducation, SubmitExperience, SubmitResume } from '@/lib/types'
import Text from "./Text";
import View from "./View";
import { formatTime } from "@/lib/helper";
import { collection, CollectionReference, deleteDoc, doc, DocumentData, DocumentReference, Timestamp, updateDoc } from "firebase/firestore";
import React from "react";
import Editable, { EditableTimestamp } from "./Editable";
import Wrapper from "./Layout/Wrapper";
import Section from "./Layout/Section";
import Indent from "./Layout/Indent";
import { bulletConverter } from "@/lib/converters";
import { generateSlug, createBullet } from "@/lib/firebase";
import { BulletPartProps } from "@/lib/props";
import { PlusButton } from "./Buttons";

export function ResumePart({ resumeSlug, onSubmit }: { resumeSlug: string, onSubmit: SubmitResume }) {
    const { resume }: ResumeHook = useResume(resumeSlug);

    if (!resume) {
        return null;
    }

    return (
        <Wrapper>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                whiteSpace: 'nowrap',
                minWidth: '400px',
                flexGrow: 1,
            }}>
                <Editable label='Your Full Name' separateLabel value={resume.fullName || ''} onSubmit={(newValue) => onSubmit('fullName', newValue)} />
                <Editable label='Your Email' separateLabel value={resume.email || ''} onSubmit={(newValue) => onSubmit('email', newValue)} />
                <Editable label='Your LinkedIn URL' separateLabel value={resume.linkedInURL || ''} onSubmit={(newValue) => onSubmit('linkedInURL', newValue)} />
                <Editable label='Your Address' separateLabel value={resume.address || ''} onSubmit={(newValue) => onSubmit('address', newValue)} />
                <Editable label='Your Phone Number' separateLabel value={resume.phone || ''} onSubmit={(newValue) => onSubmit('phone', newValue)} />
            </View>
        </Wrapper>
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

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(educationDocRef);
        await updateDoc(educationDocRef, {
            bullets: [...(education.bullets || []), newBulletRef.id],
        });
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
                        <BulletPart key={index} resumeSlug={resumeSlug} doc={education} docRef={educationDocRef} bulletSlug={bulletSlug} />
                    )
                })}

                <PlusButton onClick={createNewBullet} />
            </Indent>
        </Wrapper>
    )
}

export function ExperiencePart({ resumeSlug, experienceSlug }: { resumeSlug: string, experienceSlug: string }) {
    const { experience, experienceDocRef }: ExperienceHook = useExperience(resumeSlug, experienceSlug);

    if (!experience || !experienceDocRef) {
        return null;
    }

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(experienceDocRef);
        await updateDoc(experienceDocRef, {
            bullets: [...(experience.bullets || []), newBulletRef.id],
        });
    };

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
                        <BulletPart key={index} resumeSlug={resumeSlug} doc={experience} docRef={experienceDocRef} bulletSlug={bulletSlug} />
                    )
                })}

                <PlusButton onClick={createNewBullet} />
            </Indent>
        </Wrapper>
    )
}

export function AdditionalPart({ resumeSlug, additionalSlug }: { resumeSlug: string, additionalSlug: string }) {
    const { additional, additionalDocRef }: AdditionalHook = useAdditional(resumeSlug, additionalSlug);

    if (!additional || !additionalDocRef || !additional.bullets) {
        return null;
    }

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(additionalDocRef);
        await updateDoc(additionalDocRef, {
            bullets: [...(additional.bullets || []), newBulletRef.id],
        });
    };

    return (
        <Wrapper>
            {additional.bullets.map((bulletSlug, index) => {
                return (
                    <BulletPart key={index} resumeSlug={resumeSlug} doc={additional} docRef={additionalDocRef} bulletSlug={bulletSlug} />
                )
            })}

            <PlusButton onClick={createNewBullet} />
        </Wrapper>
    )
}

function BulletPart({ doc, docRef, resumeSlug, bulletSlug }: BulletPartProps) {
    const { bullet, bulletDocRef }: BulletHook = useBullet(resumeSlug, docRef, bulletSlug);

    if (!bullet || !bulletDocRef) {
        return null;
    }

    const handleSubmit = async (newValue: string) => {
        updateDoc(bulletDocRef, {
            text: newValue,
        })
    };

    const handleDelete = async () => {
        console.log('deleting')
        await updateDoc(docRef, {
            bullets: doc.bullets?.filter((slug) => slug !== bulletSlug),
        });

        await deleteDoc(bulletDocRef);
    }

    return (
        <Section>
            <Editable
                label='New Bullet'
                value={bullet.text}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </Section>
    );
}


