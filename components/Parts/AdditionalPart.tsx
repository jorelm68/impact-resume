import { createBullet } from "@/lib/firebase";
import { useResume } from "@/lib/hooks";
import { Bullet, ResumeHook } from "@/lib/types";
import { DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import { AddButton } from "../Buttons";
import Wrapper from "../Layout/Wrapper";
import BulletPart from "./BulletPart";
import { AdditionalPartProps } from "@/lib/props";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { reorder } from "@/lib/helper";

export default function AdditionalPart({ selection, resumeSlug, onToggleSelect }: AdditionalPartProps) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!resume || !resumeDocRef) {
        return null;
    }

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(resumeDocRef);
        await updateDoc(resumeDocRef, {
            bullets: [...(resume.bullets || []), newBulletRef.id],
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
            resume.bullets || [],
            result.source.index,
            result.destination.index
        );

        await updateDoc(resumeDocRef, {
            bullets: reorderedBullets,
            updatedAt: serverTimestamp(),
        });
    };

    return (
        <Wrapper>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="bullets">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {resume.bullets?.map((bulletSlug, index) => (
                                <Draggable key={bulletSlug} draggableId={bulletSlug} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <BulletPart
                                                selection={selection}
                                                resumeSlug={resumeSlug}
                                                doc={resume}
                                                docRef={resumeDocRef}
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