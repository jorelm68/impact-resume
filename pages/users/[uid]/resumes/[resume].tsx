import { PlusButton } from "@/components/Buttons";
import Loader from "@/components/Loader";
import AdditionalPart from "@/components/Parts/AdditionalPart";
import BulletPart from "@/components/Parts/BulletPart";
import EducationPart from "@/components/Parts/EducationPart";
import ExperiencePart from "@/components/Parts/ExperiencePart";
import ResumePart from "@/components/Parts/ResumePart";
import Text from "@/components/Text";
import View from "@/components/View";
import { createNewAdditional, createNewEducation, createNewExperience } from "@/lib/firebase";
import { formatTime, reorder } from "@/lib/helper";
import { useResume } from "@/lib/hooks";
import { ResumePageProps } from "@/lib/props";
import { Additional, Education, Experience } from "@/lib/types";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

    if (!resume || !resumeDocRef || !resume.educations || !resume.experiences || !resume.additionals) {
        return <Loader />;
    }

    const handleEducation = async () => {
        const newEducationRef: DocumentReference<Education> = await createNewEducation(resumeDocRef);
        await updateDoc(resumeDocRef, {
            educations: [...(resume.educations || []), newEducationRef.id],
        });
    }

    const handleExperience = async () => {
        const newExperienceRef: DocumentReference<Experience> = await createNewExperience(resumeDocRef);
        await updateDoc(resumeDocRef, {
            experiences: [...(resume.experiences || []), newExperienceRef.id],
        });
    }

    const handleAdditional = async () => {
        const newAdditionalRef: DocumentReference<Additional> = await createNewAdditional(resumeDocRef);
        await updateDoc(resumeDocRef, {
            additionals: [...(resume.additionals || []), newAdditionalRef.id],
        });
    }

    const handleToggleSelect = async (selectedSlug: string) => {
        await updateDoc(resumeDocRef, {
            selected: resume.selected?.includes(selectedSlug) ? resume.selected?.filter((slug) => slug !== selectedSlug) : [...(resume.selected || []), selectedSlug],
        });
    }

    const onDragEndEducations = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedEducations = reorder(
            resume.educations || [],
            result.source.index,
            result.destination.index
        );

        await updateDoc(resumeDocRef, {
            educations: reorderedEducations,
        });
    }

    const onDragEndExperiences = async (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedExperiences = reorder(
            resume.experiences || [],
            result.source.index,
            result.destination.index
        );

        await updateDoc(resumeDocRef, {
            experiences: reorderedExperiences,
        });
    }

    return (
        <main>
            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>{resumeSlug}</h2>
                <Text>Last Updated {formatTime(resume.updatedAt, 'H:M(am/pm) M D, Y')}</Text>
            </View>

            <ResumePart resumeSlug={resumeSlug} />

            <Header label='Education' onClick={handleEducation} />
            <DragDropContext onDragEnd={onDragEndEducations}>
                <Droppable droppableId="educations">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {resume.educations?.map((educationSlug, index) => (
                                <Draggable key={educationSlug} draggableId={educationSlug} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <EducationPart
                                                dragHandleProps={provided.dragHandleProps}
                                                selection={resume.selected || []}
                                                key={educationSlug}
                                                resumeSlug={resumeSlug}
                                                educationSlug={educationSlug}
                                                onToggleSelect={handleToggleSelect}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Header label='Experience' onClick={handleExperience} />
            <DragDropContext onDragEnd={onDragEndExperiences}>
                <Droppable droppableId="experiences">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {resume.experiences?.map((experienceSlug, index) => (
                                <Draggable key={experienceSlug} draggableId={experienceSlug} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <ExperiencePart
                                                dragHandleProps={provided.dragHandleProps}
                                                selection={resume.selected || []}
                                                key={experienceSlug}
                                                resumeSlug={resumeSlug}
                                                experienceSlug={experienceSlug}
                                                onToggleSelect={handleToggleSelect}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Header label='Additional' onClick={handleAdditional} />
            {resume.additionals.map((additionalSlug) => <AdditionalPart selection={resume.selected || []} key={additionalSlug} resumeSlug={resumeSlug} additionalSlug={additionalSlug} onToggleSelect={handleToggleSelect} />)}
        </main >
    )
}

function Header({ label, onClick }: { label: string, onClick?: () => Promise<void> | void }) {
    return (
        <View style={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <h2>{label}</h2>
            <PlusButton onClick={onClick} />
        </View>
    )
}