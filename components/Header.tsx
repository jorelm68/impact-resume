import { HeaderProps } from "@/lib/props";
import { View } from "@react-pdf/renderer";
import { AddButton, EditButton, CancelButton, RemoveButton } from "./Buttons";
import { useState } from "react";
import { useResume, useSection } from "@/lib/hooks";
import Loader from "./Loader";
import { createNewEducation, createNewExperience } from "@/lib/firebase";
import { Education, Experience, SectionHook } from "@/lib/types";
import { DocumentReference, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import Dots from "./Dots";
import Editable from "./Editable";

export default function Header({ isEditing, setIsEditing, sectionName, resumeSlug, dragHandleProps }: HeaderProps) {
    const { resume, resumeDocRef } = useResume(resumeSlug);
    if (!resume || !resumeDocRef) return null;

    const handleEducationAdd = async () => {
        const newEducationRef: DocumentReference<Education> = await createNewEducation(resumeDocRef);
        await updateDoc(resumeDocRef, {
            educations: [...resume.educations, newEducationRef.id],
            selected: [...resume.selected, newEducationRef.id],
            updatedAt: serverTimestamp(),
        });
    }

    const handleExperienceAdd = async () => {
        const newExperienceRef: DocumentReference<Experience> = await createNewExperience(resumeDocRef);
        await updateDoc(resumeDocRef, {
            experiences: [...resume.experiences, newExperienceRef.id],
            selected: [...resume.selected, newExperienceRef.id],
            updatedAt: serverTimestamp(),
        });
    }

    return (
        <View style={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <Dots dragHandleProps={dragHandleProps} />
            {['Education', 'Experience'].includes(sectionName) ? (
                <h2>{sectionName}</h2>
            ) : (
                <SectionHeader resumeSlug={resumeSlug} sectionSlug={sectionName} />
            )}
            {sectionName === 'Education' ? (
                <>
                    <AddButton onClick={handleEducationAdd} />
                    {resume.educations.length > 0 && !isEditing && <EditButton onClick={() => setIsEditing(true)} />}
                    {resume.educations.length > 0 && isEditing && <CancelButton onClick={() => setIsEditing(false)} />}
                </>
            ) : sectionName === 'Experience' ? (
                <>
                    <AddButton onClick={handleExperienceAdd} />
                    {resume.experiences.length > 0 && !isEditing && <EditButton onClick={() => setIsEditing(true)} />}
                    {resume.experiences.length > 0 && isEditing && <CancelButton onClick={() => setIsEditing(false)} />}
                </>
            ) : null}
        </View>
    )
}


function SectionHeader({ resumeSlug, sectionSlug }: { resumeSlug: string, sectionSlug: string }) {
    const { resume, resumeDocRef } = useResume(resumeSlug);
    const { section, sectionDocRef }: SectionHook = useSection(resumeSlug, sectionSlug);
    if (!resume || !resumeDocRef || !section || !sectionDocRef) return null;

    const handleSubmit = async (name: string) => {
        await updateDoc(sectionDocRef, {
            name,
        })
    }
    
    const handleDeleteSection = async () => {
        await updateDoc(resumeDocRef, {
            sections: resume.sections.filter((slug) => slug !== sectionSlug),
            updatedAt: serverTimestamp(),
        });

        await deleteDoc(sectionDocRef);
    }

    return (
        <Editable
            value={section.name}
            section
            onSubmit={(newValue) => handleSubmit(newValue as string)}
            onDelete={handleDeleteSection}
        />
    )
}