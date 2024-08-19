import { useAdditional, useBullet, useEducation, useExperience, useResume } from "@/lib/hooks"
import { Additional, AdditionalHook, Bullet, BulletHook, EditableValue, EducationHook, ExperienceHook, ResumeHook, SubmitEducationFields, SubmitExperienceFields, SubmitResumeFields } from '@/lib/types'
import Text from "./Text";
import View from "./View";
import { formatTime } from "@/lib/helper";
import { collection, CollectionReference, deleteDoc, doc, DocumentData, DocumentReference, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import React from "react";
import Editable from "./Editable";
import Wrapper from "./Layout/Wrapper";
import Section from "./Layout/Section";
import Indent from "./Layout/Indent";
import { bulletConverter } from "@/lib/converters";
import { generateSlug, createBullet } from "@/lib/firebase";
import { BulletPartProps } from "@/lib/props";
import { PlusButton } from "./Buttons";

export function ResumePart({ resumeSlug }: { resumeSlug: string }) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!resume || !resumeDocRef) {
        return null;
    }

    const handleSubmit = async (field: SubmitResumeFields, newValue: EditableValue) => {
        await updateDoc(resumeDocRef, {
            [field]: newValue,
            updatedAt: serverTimestamp(),
        });
    };

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
                <Editable label='Full Name' separateLabel value={resume.fullName || ''} onSubmit={(newValue: EditableValue) => handleSubmit('fullName', newValue)} />
                <Editable label='Email' separateLabel value={resume.email || ''} onSubmit={(newValue: EditableValue) => handleSubmit('email', newValue)} />
                <Editable label='LinkedIn (optional)' separateLabel value={resume.linkedInURL || ''} onSubmit={(newValue: EditableValue) => handleSubmit('linkedInURL', newValue)} />
                <Editable label='Address (optional)' separateLabel value={resume.address || ''} onSubmit={(newValue: EditableValue) => handleSubmit('address', newValue)} />
                <Editable label='Phone (optional)' separateLabel value={resume.phone || ''} onSubmit={(newValue: EditableValue) => handleSubmit('phone', newValue)} />
            </View>
        </Wrapper>
    )
}

export function EducationPart({ selection, resumeSlug, educationSlug, onToggleSelect }: { selection: string[], resumeSlug: string, educationSlug: string, onToggleSelect: (slug: string) => void }) {
    const { education, educationDocRef }: EducationHook = useEducation(resumeSlug, educationSlug);

    if (!education || !educationDocRef) {
        return null;
    }

    const handleSubmit = async (field: SubmitEducationFields, newValue: EditableValue) => {
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

    const isSelected = selection.includes(educationSlug) || false;

    return (
        <Wrapper>
            <Section isSelected={isSelected} onToggleSelect={() => onToggleSelect(educationSlug)}>
                <View style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <Editable disabled={!isSelected} bold label='School' value={education.school || ''} onSubmit={(newValue: EditableValue) => handleSubmit('school', newValue)} />
                    <Editable disabled={!isSelected} bold label='Location' value={education.location || ''} onSubmit={(newValue: EditableValue) => handleSubmit('location', newValue)} />
                </View>
                <Editable disabled={!isSelected} bold label='College' value={education.college || ''} onSubmit={(newValue: EditableValue) => handleSubmit('college', newValue)} />

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <Editable disabled={!isSelected} label='Degree(s)' value={education.degree || ''} onSubmit={(newValue: EditableValue) => handleSubmit('degree', newValue)} />
                    <Text style={{
                        paddingRight: '4px',
                    }}>,</Text>
                    <Editable disabled={!isSelected} type='timestamp' timeFormat='M, Y' label='Graduation Date' value={education.endDate} onSubmit={(newValue: EditableValue) => handleSubmit('endDate', newValue)} />
                </View>
            </Section>

            <Indent>
                {isSelected && education.bullets && education.bullets.length > 0 && education.bullets.map((bulletSlug, index) => {
                    return (
                        <BulletPart selection={selection} key={index} resumeSlug={resumeSlug} doc={education} docRef={educationDocRef} bulletSlug={bulletSlug} onToggleSelect={(bulletSlug: string) => onToggleSelect(bulletSlug)} />
                    )
                })}

                {isSelected && (
                    <PlusButton onClick={createNewBullet} />
                )}
            </Indent>
        </Wrapper>
    )
}

export function ExperiencePart({ selection, resumeSlug, experienceSlug, onToggleSelect }: { selection: string[], resumeSlug: string, experienceSlug: string, onToggleSelect: (slug: string) => void }) {
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

    const handleSubmit = async (field: SubmitExperienceFields, newValue: EditableValue) => {
        updateDoc(experienceDocRef, {
            [field]: newValue,
        })
    };

    const isSelected = selection.includes(experienceSlug) || false;

    return (
        <Wrapper>
            <Section isSelected={isSelected} onToggleSelect={() => onToggleSelect(experienceSlug)}>
                <View style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <Editable disabled={!isSelected} bold label='Organization' value={experience.organization || ''} onSubmit={(newValue: EditableValue) => handleSubmit('organization', newValue)} />
                    <Editable disabled={!isSelected} bold label='Location' value={experience.location || ''} onSubmit={(newValue: EditableValue) => handleSubmit('location', newValue)} />
                </View>
                <Editable disabled={!isSelected} bold label='Title' value={experience.title || ''} onSubmit={(newValue: EditableValue) => handleSubmit('title', newValue)} />

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                }}>
                    <Editable disabled={!isSelected} type='timestamp' timeFormat='M, Y' label='Start Date' value={experience.startDate} onSubmit={(newValue: EditableValue) => handleSubmit('startDate', newValue)} />
                    <Text>-</Text>
                    <Editable disabled={!isSelected} type='timestamp' timeFormat='M, Y' label='End Date' value={experience.endDate} onSubmit={(newValue: EditableValue) => handleSubmit('endDate', newValue)} />
                </View>
            </Section>

            <Indent>
                {isSelected && experience.bullets && experience.bullets.length > 0 && experience.bullets.map((bulletSlug, index) => {
                    return (
                        <BulletPart selection={selection} key={index} resumeSlug={resumeSlug} doc={experience} docRef={experienceDocRef} bulletSlug={bulletSlug} onToggleSelect={(bulletSlug: string) => onToggleSelect(bulletSlug)} />
                    )
                })}

                {isSelected && (
                    <PlusButton onClick={createNewBullet} />
                )}
            </Indent>
        </Wrapper>
    )
}

export function AdditionalPart({ selection, resumeSlug, additionalSlug, onToggleSelect }: { selection: string[], resumeSlug: string, additionalSlug: string, onToggleSelect: (bulletSlug: string) => void }) {
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
                    <BulletPart selection={selection} key={index} resumeSlug={resumeSlug} doc={additional} docRef={additionalDocRef} bulletSlug={bulletSlug} onToggleSelect={(bulletSlug: string) => onToggleSelect(bulletSlug)} />
                )
            })}

            <PlusButton onClick={createNewBullet} />
        </Wrapper>
    )
}

function BulletPart({ selection, doc, docRef, resumeSlug, bulletSlug, onToggleSelect }: BulletPartProps) {
    const { bullet, bulletDocRef }: BulletHook = useBullet(resumeSlug, docRef, bulletSlug);

    if (!bullet || !bulletDocRef) {
        return null;
    }

    const handleSubmit = async (newValue: EditableValue) => {
        updateDoc(bulletDocRef, {
            text: newValue,
        })
    };

    const handleDelete = async () => {
        await updateDoc(docRef, {
            bullets: doc.bullets?.filter((slug) => slug !== bulletSlug),
        });

        await deleteDoc(bulletDocRef);
    }

    return (
        <Section isSelected={selection.includes(bulletSlug) || false} onToggleSelect={() => onToggleSelect(bulletSlug)}>
            <Editable
                disabled={!selection.includes(bulletSlug)}
                label='New Bullet'
                value={bullet.text}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </Section>
    );
}


