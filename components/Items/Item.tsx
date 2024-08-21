import { list } from "firebase/storage";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EducationItem from "./EducationItem";
import ExperienceItem from "./ExperienceItem";
import SectionItem from "./SectionItem";
import { reorder } from "@/lib/helper";
import { updateDoc, serverTimestamp } from "firebase/firestore";
import { useResume } from "@/lib/hooks";
import Loader from "../Loader";

export default function Item({ isEditing, resumeSlug, sectionName }: { isEditing: boolean, resumeSlug: string, sectionName: string }) {
    const { resume, resumeDocRef } = useResume(resumeSlug);
    if (!resume || !resumeDocRef) return null;
    const list = sectionName === 'Education' ? resume.educations : resume.experiences;
    
    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedEducations = reorder(
            sectionName === 'Education' ? resume.educations : resume.experiences,
            result.source.index,
            result.destination.index
        );

        if (sectionName === 'Education') {
            await updateDoc(resumeDocRef, {
                educations: reorderedEducations,
                updatedAt: serverTimestamp(),
            });
        }
        else {
            await updateDoc(resumeDocRef, {
                experiences: reorderedEducations,
                updatedAt: serverTimestamp(),
            });
        }
    }

    return (
        <>
            {['Education', 'Experience'].includes(sectionName) ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={sectionName}>
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {list.map((slug, index) => (
                                    <Draggable key={slug} draggableId={slug} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                {sectionName === 'Education' ? (
                                                    <EducationItem
                                                        isEditing={isEditing}
                                                        key={slug}
                                                        resumeSlug={resumeSlug}
                                                        educationSlug={slug}
                                                        dragHandleProps={provided.dragHandleProps}
                                                    />
                                                ) : (
                                                    <ExperienceItem
                                                        isEditing={isEditing}
                                                        key={slug}
                                                        resumeSlug={resumeSlug}
                                                        experienceSlug={slug}
                                                        dragHandleProps={provided.dragHandleProps}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <SectionItem resumeSlug={resumeSlug} sectionSlug={sectionName} />
            )}
        </>
    )
}