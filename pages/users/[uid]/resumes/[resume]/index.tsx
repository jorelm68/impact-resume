import Loader from "@/components/Loader";
import { AdditionalPart, EducationPart, ExperiencePart, ResumePart } from "@/components/Parts";
import PlusButton from "@/components/PlusButton";
import Text from "@/components/Text";
import View from "@/components/View";
import { formatTime } from "@/lib/helper";
import { useResume } from "@/lib/hooks";
import { ResumePageProps } from "@/lib/props";
import { Timestamp } from "firebase/firestore";
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
    const { resume } = useResume(resumeSlug);

    if (!resume || !resume.educations || !resume.experiences || !resume.additionals) {
        return <Loader />;
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

            <Header label='Education' />
            {resume.educations.map((educationSlug) => <EducationPart key={educationSlug} resumeSlug={resumeSlug} educationSlug={educationSlug} />)}

            <Header label='Experience' />
            {resume.experiences.map((experienceSlug) => <ExperiencePart key={experienceSlug} resumeSlug={resumeSlug} experienceSlug={experienceSlug} />)}

            <Header label='Additional' />
            {resume.additionals.map((additionalSlug) => <AdditionalPart key={additionalSlug} resumeSlug={resumeSlug} additionalSlug={additionalSlug} />)}
        </main >
    )
}

function Header({ label }: { label: string }) {
    return (
        <View style={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <h2>{label}</h2>
            <PlusButton />
        </View>
    )
}