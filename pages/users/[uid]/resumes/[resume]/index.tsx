import Loader from "@/components/Loader";
import { AdditionalPart, EducationPart, ExperiencePart, ResumePart } from "@/components/Parts";
import PlusButton from "@/components/PlusButton";
import View from "@/components/View";
import { auth, getResumeDocRef } from "@/lib/firebase";
import { useResume } from "@/lib/hooks";
import { ResumePageProps } from "@/lib/props";
import { Resume } from "@/lib/types";
import { DocumentReference, DocumentSnapshot, onSnapshot } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { resume } = context.params as { resume: string };

    return {
        props: {
            slug: resume,
        }
    };
};

export default function ResumePage({ resumeSlug }: ResumePageProps) {
    const { resume } = useResume(resumeSlug);

    if (!resume || !resume.educations || !resume.experiences || !resume.additionals) {
        return <Loader />;
    }

    return (
        <main>
            <h1>Resume</h1>
            <ResumePart resumeSlug={resumeSlug} />

            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Education</h2>
                <PlusButton />
            </View>
            {resume.educations.map((educationSlug) => <EducationPart key={educationSlug} resumeSlug={resumeSlug} educationSlug={educationSlug} />)}

            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Experience</h2>
                <PlusButton />
            </View>
            {resume.experiences.map((experienceSlug) => <ExperiencePart key={experienceSlug} resumeSlug={resumeSlug} experienceSlug={experienceSlug} />)}

            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Additional</h2>
                <PlusButton />
            </View>
            {resume.additionals.map((additionalSlug) => <AdditionalPart key={additionalSlug} resumeSlug={resumeSlug} additionalSlug={additionalSlug} />)}
        </main >
    )
}