import { useBullet } from "@/lib/hooks";
import { BulletPartProps } from "@/lib/props";
import { BulletHook, EditableValue } from "@/lib/types";
import { updateDoc, deleteDoc } from "firebase/firestore";
import Editable from "../Editable";
import Section from "../Layout/Section";
import constants from "@/lib/constants";

export default function BulletPart({ selection, doc, docRef, resumeSlug, bulletSlug, onToggleSelect, dragHandleProps }: BulletPartProps) {
    const { bullet, bulletDocRef }: BulletHook = useBullet(resumeSlug, docRef, bulletSlug);

    if (!bullet || !bulletDocRef) {
        return null;
    }

    const handleSubmit = async (newValue: EditableValue) => {
        updateDoc(bulletDocRef, {
            text: newValue,
        })
    };

    const handleDelete = async () => {
        await updateDoc(docRef, {
            bullets: doc.bullets?.filter((slug) => slug !== bulletSlug),
        });

        await deleteDoc(bulletDocRef);
    }

    return (
        <Section dragHandleProps={dragHandleProps} isSelected={selection.includes(bulletSlug) || false} onToggleSelect={() => onToggleSelect(bulletSlug)}>
            <Editable
                disabled={!selection.includes(bulletSlug)}
                label={constants.DEFAULT_BULLET}
                value={bullet.text}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </Section>
    );
}