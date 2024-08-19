import { createBullet } from "@/lib/firebase";
import { useExperience } from "@/lib/hooks";
import { ExperienceHook, Bullet, SubmitExperienceFields, EditableValue } from "@/lib/types";
import { deleteDoc, DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import { AddButton, RemoveButton } from "../Buttons";
import Editable from "../Editable";
import Indent from "../Layout/Indent";
import Section from "../Layout/Section";
import Wrapper from "../Layout/Wrapper";
import View from "../View";
import BulletPart from "./BulletPart";
import Text from "../Text";
import { ExperiencePartProps } from "@/lib/props";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder } from "@/lib/helper";

export default function ExperiencePart({ resumeDocRef, isEditing, selection, resumeSlug, experienceSlug, onToggleSelect, onDeleteExperience, dragHandleProps }: ExperiencePartProps) {
    const { experience, experienceDocRef }: ExperienceHook = useExperience(resumeSlug, experienceSlug);

    if (!experience || !experienceDocRef) {
        return null;
    }

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(experienceDocRef);
        await updateDoc(experienceDocRef, {
            bullets: [...(experience.bullets || []), newBulletRef.id],
        });

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        });
    };

    const handleSubmit = async (field: SubmitExperienceFields, newValue: EditableValue) => {
        await updateDoc(experienceDocRef, {
            [field]: newValue,
        })

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        })
    };

    const isSelected = selection.includes(experienceSlug) || false;

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedBullets = reorder(
            experience.bullets || [],
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
            {isEditing && <RemoveButton onClick={() => onDeleteExperience(experienceDocRef)} />}

            <Wrapper>
                <Section dragHandleProps={dragHandleProps} isSelected={isSelected} onToggleSelect={() => onToggleSelect(experienceSlug)}>
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
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="experienceBullets">
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
                                                        dragHandleProps={provided.dragHandleProps}
                                                        selection={selection}
                                                        resumeSlug={resumeSlug}
                                                        doc={experience}
                                                        docRef={experienceDocRef}
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
