import { list } from "firebase/storage";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EducationItem from "./EducationItem";
import ExperienceItem from "./ExperienceItem";
import SectionItem from "./SectionItem";
import { reorder } from "@/lib/helper";
import { updateDoc, serverTimestamp } from "firebase/firestore";
import { useResume } from "@/lib/hooks";
import Loader from "../Loader";
import ProjectItem from "./ProjectItem";

export default function Item({ isEditing, resumeSlug, sectionName }: { isEditing: boolean, resumeSlug: string, sectionName: string }) {
    const { resume, resumeDocRef } = useResume(resumeSlug);
    if (!resume || !resumeDocRef) return null;
    const list = sectionName === 'Education' ? resume.educations : sectionName === 'Projects' ? resume.projects : resume.experiences;
    
    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reordered = reorder(
            sectionName === 'Education' ? resume.educations : sectionName === 'projects' ? resume.projects : resume.experiences,
            result.source.index,
            result.destination.index
        );

        if (sectionName === 'Education') {
            await updateDoc(resumeDocRef, {
                educations: reordered,
                updatedAt: serverTimestamp(),
            });
        }
        else if (sectionName === 'Projects') {
            await updateDoc(resumeDocRef, {
                projects: reordered,
                updatedAt: serverTimestamp(),
            })
        }
        else {
            await updateDoc(resumeDocRef, {
                experiences: reordered,
                updatedAt: serverTimestamp(),
            });
        }
    }

    return (
        <>
            {['Education', 'Experience', 'Projects'].includes(sectionName) ? (
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
                                                ) : sectionName === 'Experience' ? (
                                                    <ExperienceItem
                                                        isEditing={isEditing}
                                                        key={slug}
                                                        resumeSlug={resumeSlug}
                                                        experienceSlug={slug}
                                                        dragHandleProps={provided.dragHandleProps}
                                                    />
                                                ) : (
                                                    <ProjectItem
                                                        isEditing={isEditing}
                                                        key={slug}
                                                        resumeSlug={resumeSlug}
                                                        projectSlug={slug}
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