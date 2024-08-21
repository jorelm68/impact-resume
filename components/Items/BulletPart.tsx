import { useBullet, useResume } from "@/lib/hooks";
import { BulletPartProps } from "@/lib/props";
import { BulletHook, EditableValue, Resume, ResumeHook } from "@/lib/types";
import { updateDoc, deleteDoc, serverTimestamp, DocumentReference, DocumentData } from "firebase/firestore";
import Editable from "../Editable";
import constants from "@/lib/constants";
import { toggleSelect } from "@/lib/firebase";
import Loader from "../Loader";
import DraggableItem from "../Layout/DraggableItem";

export default function BulletPart({ resumeSlug, doc, docRef, bulletSlug, dragHandleProps }: BulletPartProps) {
    const { bullet, bulletDocRef }: BulletHook = useBullet(docRef, bulletSlug);
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!bullet || !bulletDocRef || !resume || !resumeDocRef) return null;

    const handleToggleSelect = async () => {
        await toggleSelect(resumeDocRef, resume.selected, bulletSlug);
    }

    const handleSubmit = async (newValue: EditableValue) => {
        updateDoc(bulletDocRef, {
            text: newValue,
        })
    };

    const handleDelete = async () => {
        await updateDoc(docRef, {
            bullets: doc.bullets.filter((slug: string) => slug !== bulletSlug),
        });

        await deleteDoc(bulletDocRef);

        await updateDoc(resumeDocRef, {
            selected: resume.selected.filter((slug: string) => slug !== bulletSlug),
            updatedAt: serverTimestamp(),
        });
    };

    return (
        <DraggableItem dragHandleProps={dragHandleProps} isSelected={resume.selected.includes(bulletSlug) || false} onToggleSelect={handleToggleSelect}>
            <Editable
                disabled={!resume.selected.includes(bulletSlug)}
                label={constants.DEFAULT_BULLET}
                value={bullet.text}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </DraggableItem>
    );
}