import { PlusButton } from "@/components/Buttons";
import Loader from "@/components/Loader";
import { AdditionalPart, EducationPart, ExperiencePart, ResumePart } from "@/components/Parts";
import Text from "@/components/Text";
import View from "@/components/View";
import { createNewAdditional, createNewEducation, createNewExperience } from "@/lib/firebase";
import { formatTime } from "@/lib/helper";
import { useResume } from "@/lib/hooks";
import { ResumePageProps } from "@/lib/props";
import { Additional, Education, Experience } from "@/lib/types";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";

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

    return (
        <main>
            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>{resumeSlug}</h2>
                <Text>{formatTime(resume.updatedAt, 'H:M(am/pm) M D, Y')}</Text>
            </View>

            <ResumePart resumeSlug={resumeSlug} />

            <Header label='Education' onClick={handleEducation} />
            {resume.educations.map((educationSlug) => <EducationPart selection={resume.selected || []} key={educationSlug} resumeSlug={resumeSlug} educationSlug={educationSlug} onToggleSelect={handleToggleSelect} />)}

            <Header label='Experience' onClick={handleExperience} />
            {resume.experiences.map((experienceSlug) => <ExperiencePart selection={resume.selected || []} key={experienceSlug} resumeSlug={resumeSlug} experienceSlug={experienceSlug} onToggleSelect={handleToggleSelect} />)}

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