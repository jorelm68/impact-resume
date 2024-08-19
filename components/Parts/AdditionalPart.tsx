import { createBullet } from "@/lib/firebase";
import { useAdditional } from "@/lib/hooks";
import { AdditionalHook, Bullet } from "@/lib/types";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { PlusButton } from "../Buttons";
import Wrapper from "../Layout/Wrapper";
import BulletPart from "./BulletPart";
import { AdditionalPartProps } from "@/lib/props";

export default function AdditionalPart({ selection, resumeSlug, additionalSlug, onToggleSelect }: AdditionalPartProps) {
    const { additional, additionalDocRef }: AdditionalHook = useAdditional(resumeSlug, additionalSlug);

    if (!additional || !additionalDocRef || !additional.bullets) {
        return null;
    }

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(additionalDocRef);
        await updateDoc(additionalDocRef, {
            bullets: [...(additional.bullets || []), newBulletRef.id],
        });
    };

    return (
        <Wrapper>
            {additional.bullets.map((bulletSlug, index) => {
                return (
                    <BulletPart selection={selection} key={index} resumeSlug={resumeSlug} doc={additional} docRef={additionalDocRef} bulletSlug={bulletSlug} onToggleSelect={(bulletSlug: string) => onToggleSelect(bulletSlug)} />
                )
            })}

            <PlusButton onClick={createNewBullet} />
        </Wrapper>
    )
}

