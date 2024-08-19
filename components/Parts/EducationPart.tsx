import { createBullet } from "@/lib/firebase";
import { useEducation } from "@/lib/hooks";
import { EducationHook, SubmitEducationFields, EditableValue, Bullet } from "@/lib/types";
import { updateDoc, DocumentReference } from "firebase/firestore";
import { PlusButton } from "../Buttons";
import Editable from "../Editable";
import Indent from "../Layout/Indent";
import Section from "../Layout/Section";
import Wrapper from "../Layout/Wrapper";
import View from "../View";
import BulletPart from "./BulletPart";
import Text from "../Text";

export default function EducationPart({ selection, resumeSlug, educationSlug, onToggleSelect }: { selection: string[], resumeSlug: string, educationSlug: string, onToggleSelect: (slug: string) => void }) {
    const { education, educationDocRef }: EducationHook = useEducation(resumeSlug, educationSlug);

    if (!education || !educationDocRef) {
        return null;
    }

    const handleSubmit = async (field: SubmitEducationFields, newValue: EditableValue) => {
        updateDoc(educationDocRef, {
            [field]: newValue,
        })
    };

    const createNewBullet = async () => {
        const newBulletRef: DocumentReference<Bullet> = await createBullet(educationDocRef);
        await updateDoc(educationDocRef, {
            bullets: [...(education.bullets || []), newBulletRef.id],
        });
    };

    const isSelected = selection.includes(educationSlug) || false;

    return (
        <Wrapper>
            <Section isSelected={isSelected} onToggleSelect={() => onToggleSelect(educationSlug)}>
                <View style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <Editable disabled={!isSelected} bold label='School' value={education.school || ''} onSubmit={(newValue: EditableValue) => handleSubmit('school', newValue)} />
                    <Editable disabled={!isSelected} bold label='Location' value={education.location || ''} onSubmit={(newValue: EditableValue) => handleSubmit('location', newValue)} />
                </View>
                <Editable disabled={!isSelected} bold label='College' value={education.college || ''} onSubmit={(newValue: EditableValue) => handleSubmit('college', newValue)} />

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <Editable disabled={!isSelected} label='Degree(s)' value={education.degree || ''} onSubmit={(newValue: EditableValue) => handleSubmit('degree', newValue)} />
                    <Text style={{
                        paddingRight: '4px',
                    }}>,</Text>
                    <Editable disabled={!isSelected} type='timestamp' timeFormat='M, Y' label='Graduation Date' value={education.endDate} onSubmit={(newValue: EditableValue) => handleSubmit('endDate', newValue)} />
                </View>
            </Section>

            <Indent>
                {isSelected && education.bullets && education.bullets.length > 0 && education.bullets.map((bulletSlug, index) => {
                    return (
                        <BulletPart selection={selection} key={index} resumeSlug={resumeSlug} doc={education} docRef={educationDocRef} bulletSlug={bulletSlug} onToggleSelect={(bulletSlug: string) => onToggleSelect(bulletSlug)} />
                    )
                })}

                {isSelected && (
                    <PlusButton onClick={createNewBullet} />
                )}
            </Indent>
        </Wrapper>
    )
}