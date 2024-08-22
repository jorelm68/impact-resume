import { AddButton, PDFButton } from "@/components/Buttons";
import Editable from "@/components/Editable";
import Loader from "@/components/Loader";
import Contact from "@/components/Items/Contact";
import Text from "@/components/Text";
import View from "@/components/View";
import { formatTime, reorder } from "@/lib/helper";
import { useResume } from "@/lib/hooks";
import { ResumePageProps } from "@/lib/props";
import { EditableValue, Resume, Section, User } from "@/lib/types";
import { collection, doc, DocumentReference, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ResumeItem from "@/components/Items/ResumeItem";
import { useState } from "react";
import { auth, firestore, generateSlug, getResumeDocRef } from "@/lib/firebase";
import { CollectionReference } from "firebase/firestore/lite";
import { userConverter, resumeConverter, sectionConverter } from "@/lib/converters";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { resume } = context.params as { resume: string };

    return {
        props: {
            resumeSlug: resume,
        }
    };
};

export default function ResumePage({ resumeSlug }: ResumePageProps) {
    const { resume, resumeDocRef } = useResume(resumeSlug);
    const [sectionName, setSectionName] = useState('');
    if (!resume || !resumeDocRef) return null;
    const isValid = sectionName.length > 0 && !resume.sections.includes(sectionName);

    const handleCreateSection = async (e: any) => {
        e.preventDefault();

        const slug = generateSlug();
        const data = {
            slug,
            name: sectionName,
            bullets: [],
        }
        const sectionCollectionRef: CollectionReference<Section> = collection(resumeDocRef, 'sections').withConverter(sectionConverter);
        const sectionDocRef: DocumentReference<Section> = doc(sectionCollectionRef, slug).withConverter(sectionConverter);
        await setDoc(sectionDocRef, data);

        await updateDoc(resumeDocRef, {
            sections: [...resume.sections, slug],
            updatedAt: serverTimestamp(),
        });

        setSectionName('');
    }

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedSections = reorder(
            resume.sections,
            result.source.index,
            result.destination.index
        );

        await updateDoc(resumeDocRef, {
            sections: reorderedSections,
            updatedAt: serverTimestamp(),
        });
    }

    return (
        <main>
            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
            }}>
                <View style={{
                    display: 'flex',
                    gap: '16px',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <PDFButton resumeSlug={resumeSlug} />
                    <Editable
                        header
                        label='Resume'
                        value={resume.resumeName}
                        onSubmit={(newValue: EditableValue) => updateDoc(resumeDocRef, { resumeName: newValue, updatedAt: serverTimestamp() })}
                    />
                </View>
                <Text>Last Updated {formatTime(resume.updatedAt, 'H:M(am/pm) M D, Y')}</Text>
            </View>

            <Contact resumeSlug={resumeSlug} />

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {resume.sections.map((sectionName, index) => (
                                <ResumeItem key={sectionName} index={index} sectionName={sectionName} resumeSlug={resumeSlug} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <form onSubmit={handleCreateSection} style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                paddingTop: '16px',
                paddingBottom: '16px',
                flexWrap: 'wrap',
            }}>
                <input
                    style={{
                        width: '50%',
                        minWidth: '300px',
                    }}
                    value={sectionName}
                    onChange={(e: any) => setSectionName(e.target.value)}
                    placeholder="Section Name"
                />

                <button type='submit' disabled={!isValid} className='btn-green' style={{
                    margin: '0px',
                }}>
                    Create New Section
                </button>
            </form>
        </main >
    )
}




