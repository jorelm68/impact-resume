import { createBullet, toggleSelect } from "@/lib/firebase";
import { useEducation, useResume } from "@/lib/hooks";
import { EducationHook, SubmitEducationFields, EditableValue, ResumeHook } from "@/lib/types";
import { updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { AddButton, RemoveButton } from "../Buttons";
import Editable from "../Editable";
import Indent from "../Layout/Indent";
import Wrapper from "../Layout/Wrapper";
import View from "../View";
import BulletPart from "./BulletPart";
import Text from "../Text";
import { EducationItemProps } from "@/lib/props";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder } from "@/lib/helper";
import Loader from "../Loader";
import DraggableItem from "../Layout/DraggableItem";

export default function EducationItem({ isEditing, educationSlug, resumeSlug, dragHandleProps }: EducationItemProps) {
    const { education, educationDocRef }: EducationHook = useEducation(resumeSlug, educationSlug);
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    if (!education || !educationDocRef || !resume || !resumeDocRef) return null;
    const isSelected = resume.selected.includes(educationSlug) || false;

    const handleSubmit = async (field: SubmitEducationFields, newValue: EditableValue) => {
        await updateDoc(educationDocRef, {
            [field]: newValue,
        })

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        });
    };

    const handleDelete = async () => {
        await updateDoc(resumeDocRef, {
            educations: resume.educations.filter((slug: string) => slug !== educationSlug),
            selected: resume.selected.filter((slug: string) => slug !== educationSlug),
            updatedAt: serverTimestamp(),
        });

        await deleteDoc(educationDocRef);
    }

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedBullets = reorder(
            education.bullets,
            result.source.index,
            result.destination.index
        );

        await updateDoc(educationDocRef, {
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
                <DraggableItem dragHandleProps={dragHandleProps} isSelected={isSelected} onToggleSelect={() => toggleSelect(resumeDocRef, resume.selected, educationSlug)}>
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
                </DraggableItem>

                <Indent>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={`${educationSlug}-bullets`}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {isSelected && education.bullets && education.bullets.length > 0 && education.bullets.map((bulletSlug, index) => (
                                        <Draggable key={bulletSlug} draggableId={bulletSlug} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                >
                                                    <BulletPart
                                                        resumeSlug={resumeSlug}
                                                        bulletSlug={bulletSlug}
                                                        doc={education}
                                                        docRef={educationDocRef}
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
                        <AddButton onClick={() => createBullet(resume, resumeDocRef, education, educationDocRef)} />
                    )}
                </Indent>
            </Wrapper>
        </View>
    )
}