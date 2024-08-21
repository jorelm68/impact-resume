import { createBullet } from "@/lib/firebase";
import { useResume, useSection } from "@/lib/hooks";
import { Bullet, ResumeHook, SectionHook } from "@/lib/types";
import { DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import { AddButton } from "../Buttons";
import Wrapper from "../Layout/Wrapper";
import BulletPart from "./BulletPart";
import { SectionItemProps } from "@/lib/props";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { reorder } from "@/lib/helper";
import Loader from "../Loader";

export default function SectionItem({ resumeSlug, sectionSlug }: SectionItemProps) {
    const { section, sectionDocRef }: SectionHook = useSection(resumeSlug, sectionSlug);
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    if (!section || !sectionDocRef || !resume || !resumeDocRef) return null;

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const reorderedBullets = reorder(
            section.bullets || [],
            result.source.index,
            result.destination.index
        );

        await updateDoc(sectionDocRef, {
            bullets: reorderedBullets,
            updatedAt: serverTimestamp(),
        });
    };

    return (
        <Wrapper>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`${sectionSlug}-bullets`}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {section.bullets?.map((bulletSlug, index) => (
                                <Draggable key={bulletSlug} draggableId={bulletSlug} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <BulletPart
                                                resumeSlug={resumeSlug}
                                                bulletSlug={bulletSlug}
                                                doc={section}
                                                docRef={sectionDocRef}
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

            <AddButton onClick={() => createBullet(resume, resumeDocRef, section, sectionDocRef)} />
        </Wrapper>
    );
}