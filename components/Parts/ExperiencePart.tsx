import { createBullet } from "@/lib/firebase";
import { useExperience } from "@/lib/hooks";
import { ExperienceHook, Bullet, SubmitExperienceFields, EditableValue } from "@/lib/types";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { PlusButton } from "../Buttons";
import Editable from "../Editable";
import Indent from "../Layout/Indent";
import Section from "../Layout/Section";
import Wrapper from "../Layout/Wrapper";
import View from "../View";
import BulletPart from "./BulletPart";
import Text from "../Text";
import { ExperiencePartProps } from "@/lib/props";

export default function ExperiencePart({ selection, resumeSlug, experienceSlug, onToggleSelect }: ExperiencePartProps) {
    const { experience, experienceDocRef }: ExperienceHook = useExperience(resumeSlug, experienceSlug);

    if (!experience || !experienceDocRef) {
        return null;
    }

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(experienceDocRef);
        await updateDoc(experienceDocRef, {
            bullets: [...(experience.bullets || []), newBulletRef.id],
        });
    };

    const handleSubmit = async (field: SubmitExperienceFields, newValue: EditableValue) => {
        updateDoc(experienceDocRef, {
            [field]: newValue,
        })
    };

    const isSelected = selection.includes(experienceSlug) || false;

    return (
        <Wrapper>
            <Section isSelected={isSelected} onToggleSelect={() => onToggleSelect(experienceSlug)}>
                <View style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <Editable disabled={!isSelected} bold label='Organization' value={experience.organization || ''} onSubmit={(newValue: EditableValue) => handleSubmit('organization', newValue)} />
                    <Editable disabled={!isSelected} bold label='Location' value={experience.location || ''} onSubmit={(newValue: EditableValue) => handleSubmit('location', newValue)} />
                </View>
                <Editable disabled={!isSelected} bold label='Title' value={experience.title || ''} onSubmit={(newValue: EditableValue) => handleSubmit('title', newValue)} />

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                }}>
                    <Editable disabled={!isSelected} type='timestamp' timeFormat='M, Y' label='Start Date' value={experience.startDate} onSubmit={(newValue: EditableValue) => handleSubmit('startDate', newValue)} />
                    <Text>-</Text>
                    <Editable disabled={!isSelected} type='timestamp' timeFormat='M, Y' label='End Date' value={experience.endDate} onSubmit={(newValue: EditableValue) => handleSubmit('endDate', newValue)} />
                </View>
            </Section>

            <Indent>
                {isSelected && experience.bullets && experience.bullets.length > 0 && experience.bullets.map((bulletSlug, index) => {
                    return (
                        <BulletPart selection={selection} key={index} resumeSlug={resumeSlug} doc={experience} docRef={experienceDocRef} bulletSlug={bulletSlug} onToggleSelect={(bulletSlug: string) => onToggleSelect(bulletSlug)} />
                    )
                })}

                {isSelected && (
                    <PlusButton onClick={createNewBullet} />
                )}
            </Indent>
        </Wrapper>
    )
}
