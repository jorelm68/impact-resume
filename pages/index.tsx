import DraggableList from "@/components/DraggableList";
import { useState } from "react";

// Define initial items
const initialItems = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
];

export default function Home() {
  const [items, setItems] = useState(initialItems);

  // Handle reordering of items
  const handleReorder = (newItems: { id: string; content: string }[]) => {
    setItems(newItems);
  };

  return (
    <div style={{ width: '300px', margin: '0 auto' }}>
      <h3>Draggable List</h3>
      <DraggableList items={items} onReorder={handleReorder} />
    </div>
  );
}
