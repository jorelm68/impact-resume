import { AdditionalPart, EducationPart, ExperiencePart } from "@/components/Parts";
import { useResume } from "@/lib/hooks";
import { ResumePageProps } from "@/lib/props";
import { Resume } from "@/lib/types";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { resume } = context.params as { resume: string };

    return {
        props: {
            resume,
        }
    };
};

export default function ResumePage({ resume }: ResumePageProps) {
    const resumeDoc: Resume | null = useResume(resume);

    if (!resumeDoc || !resumeDoc.educations || !resumeDoc.experiences || !resumeDoc.additionals) {
        return <p>Loading...</p>
    }

    return (
        <main>
            <h1>Resume</h1>

            <EducationPart resume={resume} slug={resumeDoc.educations[0]} />
            <ExperiencePart resume={resume} slug={resumeDoc.experiences[0]} />
            <AdditionalPart resume={resume} slug={resumeDoc.additionals[0]} />
        </main>
    )
}