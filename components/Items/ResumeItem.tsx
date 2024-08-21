import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import Header from "../Header";
import Item from "./Item";

export default function ResumeItem({ sectionName, index, resumeSlug }: { sectionName: string, index: number, resumeSlug: string }) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Draggable draggableId={sectionName} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <Header
                        isEditing={isEditing}
                        resumeSlug={resumeSlug}
                        sectionName={sectionName}
                        setIsEditing={setIsEditing}
                        dragHandleProps={provided.dragHandleProps}
                    />
                    <Item
                        isEditing={isEditing}
                        resumeSlug={resumeSlug}
                        sectionName={sectionName}
                    />
                </div>
            )}
        </Draggable>
    )
}