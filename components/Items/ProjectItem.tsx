import { createBullet, toggleSelect } from "@/lib/firebase";
import { useProject, useResume } from "@/lib/hooks";
import { EditableValue, ResumeHook, ProjectHook, SubmitProjectFields } from "@/lib/types";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { AddButton, RemoveButton } from "../Buttons";
import Editable from "../Editable";
import Indent from "../Layout/Indent";
import Wrapper from "../Layout/Wrapper";
import View from "../View";
import BulletPart from "./BulletPart";
import Text from "../Text";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder } from "@/lib/helper";
import Loader from "../Loader";
import DraggableItem from "../Layout/DraggableItem";
import { ProjectItemProps } from "@/lib/props";

export default function ProjectItem({ isEditing, resumeSlug, projectSlug, dragHandleProps }: ProjectItemProps) {
    const { project, projectDocRef }: ProjectHook = useProject(resumeSlug, projectSlug);
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    if (!project || !projectDocRef || !resume || !resumeDocRef) return null;
    const isSelected = resume.selected.includes(projectSlug) || false;

    const handleSubmit = async (field: SubmitProjectFields, newValue: EditableValue) => {
        await updateDoc(projectDocRef, {
            [field]: newValue,
        })

        await updateDoc(resumeDocRef, {
            updatedAt: serverTimestamp(),
        })
    };

    const handleDelete = async () => {
        await updateDoc(resumeDocRef, {
            projects: resume.projects.filter((slug: string) => slug !== projectSlug),
            selected: resume.selected.filter((slug: string) => slug !== projectSlug),
            updatedAt: serverTimestamp(),
        });

        await deleteDoc(projectDocRef);
    }


    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedBullets = reorder(
            project.bullets,
            result.source.index,
            result.destination.index
        );

        await updateDoc(projectDocRef, {
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
                <DraggableItem dragHandleProps={dragHandleProps} isSelected={isSelected} onToggleSelect={() => toggleSelect(resumeDocRef, resume.selected, projectSlug)}>
                    <Editable disabled={!isSelected} bold label='Name' value={project.name || ''} onSubmit={(newValue: EditableValue) => handleSubmit('name', newValue)} />

                    <View style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Editable disabled={!isSelected} label='Link' value={project.link || ''} onSubmit={(newValue: EditableValue) => handleSubmit('link', newValue)} />
                        <Editable disabled={!isSelected} label='Front-End' value={project.github} onSubmit={(newValue: EditableValue) => handleSubmit('github', newValue)} />
                        <Editable disabled={!isSelected} label='Back-End' value={project.github2} onSubmit={(newValue: EditableValue) => handleSubmit('github2', newValue)} />
                        <Editable disabled={!isSelected} label='Languages' value={project.languages} onSubmit={(newValue: EditableValue) => handleSubmit('languages', newValue)} />
                        <Editable disabled={!isSelected} label='Tech Stack' value={project.techStack} onSubmit={(newValue: EditableValue) => handleSubmit('techStack', newValue)} />
                    </View>
                </DraggableItem>

                <Indent>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={`${projectSlug}-bullets`}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {isSelected && project.bullets && project.bullets.length > 0 && project.bullets.map((bulletSlug, index) => (
                                        <Draggable key={bulletSlug} draggableId={bulletSlug} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                >
                                                    <BulletPart
                                                        resumeSlug={resumeSlug}
                                                        bulletSlug={bulletSlug}
                                                        doc={project}
                                                        docRef={projectDocRef}
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
                        <AddButton onClick={() => createBullet(resume, resumeDocRef, project, projectDocRef)} />
                    )}
                </Indent>
            </Wrapper>
        </View>
    )
}
