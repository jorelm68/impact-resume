import { createBullet } from "@/lib/firebase";
import { useAdditional, useResume } from "@/lib/hooks";
import { AdditionalHook, Bullet, ResumeHook } from "@/lib/types";
import { DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import { AddButton } from "../Buttons";
import Wrapper from "../Layout/Wrapper";
import BulletPart from "./BulletPart";
import { AdditionalPartProps } from "@/lib/props";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { reorder } from "@/lib/helper";

export default function AdditionalPart({ selection, resumeSlug, additionalSlug, onToggleSelect }: AdditionalPartProps) {
    const { additional, additionalDocRef }: AdditionalHook = useAdditional(resumeSlug, additionalSlug);
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!additional || !additionalDocRef || !additional.bullets || !resume || !resumeDocRef) {
        return null;
    }

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(additionalDocRef);
        await updateDoc(additionalDocRef, {
            bullets: [...(additional.bullets || []), newBulletRef.id],
        });

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
            selected: [...(resume.selected || []), newBulletRef.id],
        })
    };

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const reorderedBullets = reorder(
            additional.bullets || [],
            result.source.index,
            result.destination.index
        );

        await updateDoc(additionalDocRef, {
            bullets: reorderedBullets,
        });

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        });
    };

    return (
        <Wrapper>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="additionalBullets">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {additional.bullets?.map((bulletSlug, index) => (
                                <Draggable key={bulletSlug} draggableId={bulletSlug} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <BulletPart
                                                selection={selection}
                                                resumeSlug={resumeSlug}
                                                doc={additional}
                                                docRef={additionalDocRef}
                                                bulletSlug={bulletSlug}
                                                onToggleSelect={(slug: string) => onToggleSelect(slug)}
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

            <AddButton onClick={createNewBullet} />
        </Wrapper>
    );
}