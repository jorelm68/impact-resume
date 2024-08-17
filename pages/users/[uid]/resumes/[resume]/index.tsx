import { AdditionalPart, EducationPart, ExperiencePart } from "@/components/Parts";
import PlusButton from "@/components/PlusButton";
import View from "@/components/View";
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


            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Education</h2>
                <PlusButton />
            </View>
            {resumeDoc.educations.map((slug) => <EducationPart key={slug} resume={resume} slug={slug} />)}

            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Experience</h2>
                <PlusButton />
            </View>
            {resumeDoc.experiences.map((slug) => <ExperiencePart key={slug} resume={resume} slug={slug} />)}

            <View style={{
                display: 'flex',
                gap: '16px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <h2>Additional</h2>
                <PlusButton />
            </View>
            {resumeDoc.additionals.map((slug) => <AdditionalPart key={slug} resume={resume} slug={slug} />)}
        </main >
    )
}