import DraggableList from "@/components/DraggableList";
import ResumePDF from "@/components/ResumePDF";
import { useState } from "react";

// Define initial items
const initialItems = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
];

export default function Home() {
  return (
    <ResumePDF resumeSlug={'hog-buddy'}/>
  );
}
