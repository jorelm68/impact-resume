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

export default function ResumePage({ slug }: ResumePageProps) {
    const { resume } = useResume(slug);

    if (!resume || !resume.educations || !resume.experiences || !resume.additionals) {
        return <Loader />;
    }

    return (
        <main>
            <h1>Resume</h1>
            <ResumePart slug={slug} />

            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Education</h2>
                <PlusButton />
            </View>
            {resume.educations.map((educationSlug) => <EducationPart key={educationSlug} resume={slug} slug={educationSlug} />)}

            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Experience</h2>
                <PlusButton />
            </View>
            {resume.experiences.map((experienceSlug) => <ExperiencePart key={experienceSlug} resume={slug} slug={experienceSlug} />)}

            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Additional</h2>
                <PlusButton />
            </View>
            {resume.additionals.map((additionalSlug) => <AdditionalPart key={additionalSlug} resume={slug} slug={additionalSlug} />)}
        </main >
    )
}