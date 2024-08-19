import { AddButton, CancelButton, EditButton } from "@/components/Buttons";
import Editable from "@/components/Editable";
import Loader from "@/components/Loader";
import AdditionalPart from "@/components/Parts/AdditionalPart";
import BulletPart from "@/components/Parts/BulletPart";
import EducationPart from "@/components/Parts/EducationPart";
import ExperiencePart from "@/components/Parts/ExperiencePart";
import ResumePart from "@/components/Parts/ResumePart";
import Text from "@/components/Text";
import View from "@/components/View";
import { createNewAdditional, createNewEducation, createNewExperience } from "@/lib/firebase";
import { formatTime, reorder } from "@/lib/helper";
import { useResume } from "@/lib/hooks";
import { ResumePageProps } from "@/lib/props";
import { Additional, EditableValue, Education, Experience } from "@/lib/types";
import { deleteDoc, DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { resume } = context.params as { resume: string };

    return {
        props: {
            resumeSlug: resume,
        }
    };
};

export default function ResumePage({ resumeSlug }: ResumePageProps) {
    const { resume, resumeDocRef } = useResume(resumeSlug);
    const [editingEducation, setEditingEducation] = useState<boolean>(false);
    const [editingExperience, setEditingExperience] = useState<boolean>(false);

    if (!resume || !resumeDocRef || !resume.educations || !resume.experiences || !resume.additionals) {
        return <Loader />;
    }

    const handleEducationAdd = async () => {
        const newEducationRef: DocumentReference<Education> = await createNewEducation(resumeDocRef);
        await updateDoc(resumeDocRef, {
            educations: [...(resume.educations || []), newEducationRef.id],
            updatedAt: serverTimestamp(),
        });
    }

    const handleExperienceAdd = async () => {
        const newExperienceRef: DocumentReference<Experience> = await createNewExperience(resumeDocRef);
        await updateDoc(resumeDocRef, {
            experiences: [...(resume.experiences || []), newExperienceRef.id],
            updatedAt: serverTimestamp(),
        });
    }

    const handleToggleSelect = async (selectedSlug: string) => {
        await updateDoc(resumeDocRef, {
            selected: resume.selected?.includes(selectedSlug) ? resume.selected?.filter((slug) => slug !== selectedSlug) : [...(resume.selected || []), selectedSlug],
            updatedAt: serverTimestamp(),
        });
    }

    const handleDeleteEducation = async (educationDocRef: DocumentReference<Education>) => {
        await updateDoc(resumeDocRef, {
            educations: resume.educations?.filter((slug) => slug !== educationDocRef.id),
            updatedAt: serverTimestamp(),
        });

        await deleteDoc(educationDocRef);
    }

    const handleDeleteExperience = async (experienceDocRef: DocumentReference<Experience>) => {
        await updateDoc(resumeDocRef, {
            experiences: resume.experiences?.filter((slug) => slug !== experienceDocRef.id),
            updatedAt: serverTimestamp(),
        });

        await deleteDoc(experienceDocRef);
    }

    const onDragEndEducations = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedEducations = reorder(
            resume.educations || [],
            result.source.index,
            result.destination.index
        );

        await updateDoc(resumeDocRef, {
            educations: reorderedEducations,
            updatedAt: serverTimestamp(),
        });
    }

    const onDragEndExperiences = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedExperiences = reorder(
            resume.experiences || [],
            result.source.index,
            result.destination.index
        );

        await updateDoc(resumeDocRef, {
            experiences: reorderedExperiences,
            updatedAt: serverTimestamp(),
        });
    }

    return (
        <main>
            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
            }}>
                <Editable
                    header
                    label='Resume'
                    value={resume.resumeName}
                    onSubmit={(newValue: EditableValue) => updateDoc(resumeDocRef, { resumeName: newValue })}
                />
                <Text>Last Updated {formatTime(resume.updatedAt, 'H:M(am/pm) M D, Y')}</Text>
            </View>

            <ResumePart resumeSlug={resumeSlug} />

            <Header
                label='Education'
                onAdd={handleEducationAdd}
                onEdit={() => setEditingEducation(true)}
                onCancel={() => setEditingEducation(false)}
                isEditing={editingEducation}
            />
            <DragDropContext onDragEnd={onDragEndEducations}>
                <Droppable droppableId="educations">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {resume.educations?.map((educationSlug, index) => (
                                <Draggable key={educationSlug} draggableId={educationSlug} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <EducationPart
                                                resumeDocRef={resumeDocRef}
                                                onDeleteEducation={handleDeleteEducation}
                                                isEditing={editingEducation}
                                                dragHandleProps={provided.dragHandleProps}
                                                selection={resume.selected || []}
                                                key={educationSlug}
                                                resumeSlug={resumeSlug}
                                                educationSlug={educationSlug}
                                                onToggleSelect={handleToggleSelect}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Header
                label='Experience'
                onAdd={handleExperienceAdd}
                onEdit={() => setEditingExperience(true)}
                onCancel={() => setEditingExperience(false)}
                isEditing={editingExperience}
            />
            <DragDropContext onDragEnd={onDragEndExperiences}>
                <Droppable droppableId="experiences">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {resume.experiences?.map((experienceSlug, index) => (
                                <Draggable key={experienceSlug} draggableId={experienceSlug} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <ExperiencePart
                                                resumeDocRef={resumeDocRef}
                                                onDeleteExperience={handleDeleteExperience}
                                                isEditing={editingExperience}
                                                dragHandleProps={provided.dragHandleProps}
                                                selection={resume.selected || []}
                                                key={experienceSlug}
                                                resumeSlug={resumeSlug}
                                                experienceSlug={experienceSlug}
                                                onToggleSelect={handleToggleSelect}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Header label='Additional' />
            {resume.additionals.map((additionalSlug) => <AdditionalPart selection={resume.selected || []} key={additionalSlug} resumeSlug={resumeSlug} additionalSlug={additionalSlug} onToggleSelect={handleToggleSelect} />)}
        </main >
    )
}

interface HeaderProps {
    label: string;
    onAdd?: () => Promise<void> | void;
    onEdit?: () => Promise<void> | void;
    onCancel?: () => Promise<void> | void;
    isEditing?: boolean;
}

function Header({ label, onAdd, onEdit, onCancel, isEditing }: HeaderProps) {
    return (
        <View style={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <h2>{label}</h2>
            {onAdd && <AddButton onClick={onAdd} />}
            {onEdit && !isEditing && <EditButton onClick={onEdit} />}
            {onEdit && isEditing && <CancelButton onClick={onCancel} />}
        </View>
    )
}