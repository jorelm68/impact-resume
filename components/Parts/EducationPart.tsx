import { createBullet } from "@/lib/firebase";
import { useEducation } from "@/lib/hooks";
import { EducationHook, SubmitEducationFields, EditableValue, Bullet } from "@/lib/types";
import { updateDoc, DocumentReference, deleteDoc, serverTimestamp } from "firebase/firestore";
import { AddButton, RemoveButton } from "../Buttons";
import Editable from "../Editable";
import Indent from "../Layout/Indent";
import Section from "../Layout/Section";
import Wrapper from "../Layout/Wrapper";
import View from "../View";
import BulletPart from "./BulletPart";
import Text from "../Text";
import { EducationPartProps } from "@/lib/props";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder } from "@/lib/helper";

export default function EducationPart({ resumeDocRef, isEditing, selection, resumeSlug, educationSlug, onToggleSelect, onDeleteEducation, dragHandleProps }: EducationPartProps) {
    const { education, educationDocRef }: EducationHook = useEducation(resumeSlug, educationSlug);

    if (!education || !educationDocRef) {
        return null;
    }

    const handleSubmit = async (field: SubmitEducationFields, newValue: EditableValue) => {
        await updateDoc(educationDocRef, {
            [field]: newValue,
        })

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        });
    };

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(educationDocRef);
        await updateDoc(educationDocRef, {
            bullets: [...(education.bullets || []), newBulletRef.id],
        });

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        });
    };

    const isSelected = selection.includes(educationSlug) || false;

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedBullets = reorder(
            education.bullets || [],
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
            {isEditing && <RemoveButton onClick={() => onDeleteEducation(educationDocRef)} />}
            <Wrapper>
                <Section dragHandleProps={dragHandleProps} isSelected={isSelected} onToggleSelect={() => onToggleSelect(educationSlug)}>
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
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="educationBullets">
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
                                                        dragHandleProps={provided.dragHandleProps}
                                                        selection={selection}
                                                        resumeSlug={resumeSlug}
                                                        doc={education}
                                                        docRef={educationDocRef}
                                                        bulletSlug={bulletSlug}
                                                        onToggleSelect={(slug: string) => onToggleSelect(slug)}
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
                        <AddButton onClick={createNewBullet} />
                    )}
                </Indent>
            </Wrapper>
        </View>
    )
}