import { ResumeFeedProps } from "@/lib/props";
import { Resume } from "@/lib/types";

export default function ResumeFeed(props: ResumeFeedProps) {
    return (
        <div>
            <h1>Resume Feed</h1>
            {props.resumes.map((resume: Resume, index: number) => {
                return (
                    <ResumeItem key={index} resume={resume} />
                )
            })}
        </div>
    );
}

function ResumeItem({ resume }: { resume: Resume }) {

    return (
        <p>{resume.slug}</p>
    )
}