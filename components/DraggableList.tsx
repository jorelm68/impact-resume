import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Define the types for the item and the list
interface Item {
  id: string;
  content: string;
}

interface Props {
  items: Item[];
  onReorder: (items: Item[]) => void;
}

// Sample component for drag-and-drop
const DraggableList: React.FC<Props> = ({ items, onReorder }) => {
  const handleDragEnd = (result: DropResult) => {
    // Do nothing if the item was dropped outside the list
    if (!result.destination) return;

    const { source, destination } = result;

    // Make a copy of the items
    const updatedItems = Array.from(items);
    // Remove the item from the source position
    const [movedItem] = updatedItems.splice(source.index, 1);
    // Insert the item into the destination position
    updatedItems.splice(destination.index, 0, movedItem);

    // Call the onReorder callback with the new order
    onReorder(updatedItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ listStyleType: 'none', padding: 0 }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      padding: 8,
                      margin: '0 0 8px 0',
                      border: '1px solid lightgrey',
                      borderRadius: 4,
                      backgroundColor: 'white',
                    }}
                  >
                    {item.content}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;
