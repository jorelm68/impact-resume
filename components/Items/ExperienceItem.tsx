import { createBullet, toggleSelect } from "@/lib/firebase";
import { useExperience, useResume } from "@/lib/hooks";
import { ExperienceHook, SubmitExperienceFields, EditableValue, ResumeHook } from "@/lib/types";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { AddButton, RemoveButton } from "../Buttons";
import Editable from "../Editable";
import Indent from "../Layout/Indent";
import Wrapper from "../Layout/Wrapper";
import View from "../View";
import BulletPart from "./BulletPart";
import Text from "../Text";
import { ExperienceItemProps } from "@/lib/props";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder } from "@/lib/helper";
import Loader from "../Loader";
import DraggableItem from "../Layout/DraggableItem";

export default function ExperienceItem({ isEditing, resumeSlug, experienceSlug, dragHandleProps }: ExperienceItemProps) {
    const { experience, experienceDocRef }: ExperienceHook = useExperience(resumeSlug, experienceSlug);
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    if (!experience || !experienceDocRef || !resume || !resumeDocRef) return null;
    const isSelected = resume.selected.includes(experienceSlug) || false;

    const handleSubmit = async (field: SubmitExperienceFields, newValue: EditableValue) => {
        await updateDoc(experienceDocRef, {
            [field]: newValue,
        })

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        })
    };

    const handleDelete = async () => {
        await updateDoc(resumeDocRef, {
            experiences: resume.experiences.filter((slug: string) => slug !== experienceSlug),
            selected: resume.selected.filter((slug: string) => slug !== experienceSlug),
            updatedAt: serverTimestamp(),
        });

        await deleteDoc(experienceDocRef);
    }


    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedBullets = reorder(
            experience.bullets,
            result.source.index,
            result.destination.index
        );

        await updateDoc(experienceDocRef, {
            bullets: reorderedBullets,
        });

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        });
    };

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            alignItems: 'center',
        }}>
            {isEditing && <RemoveButton onClick={handleDelete} />}

            <Wrapper>
                <DraggableItem dragHandleProps={dragHandleProps} isSelected={isSelected} onToggleSelect={() => toggleSelect(resumeDocRef, resume.selected, experienceSlug)}>
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
                        <Editable disabled={!isSelected} type='timestamp' timeFormat='M, Y' label='Present' value={experience.endDate} onSubmit={(newValue: EditableValue) => handleSubmit('endDate', newValue)} />
                    </View>
                </DraggableItem>

                <Indent>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={`${experienceSlug}-bullets`}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {isSelected && experience.bullets && experience.bullets.length > 0 && experience.bullets.map((bulletSlug, index) => (
                                        <Draggable key={bulletSlug} draggableId={bulletSlug} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                >
                                                    <BulletPart
                                                        resumeSlug={resumeSlug}
                                                        bulletSlug={bulletSlug}
                                                        doc={experience}
                                                        docRef={experienceDocRef}
                                                        dragHandleProps={provided.dragHandleProps}
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

                    {isSelected && (
                        <AddButton onClick={() => createBullet(resume, resumeDocRef, experience, experienceDocRef)} />
                    )}
                </Indent>
            </Wrapper>
        </View>
    )
}
