import { auth } from "@/lib/firebase";
import { useAdditionals } from "@/lib/hooks";
import { AdditionalPageProps } from "@/lib/props";
import { Additional } from "@/lib/types";

export default function AdditionalsPage(props: AdditionalPageProps) {
    const { resume } = props.params as { resume: string };

    return (
        <main>
            <h1>Additionals</h1>

            <AdditionalList resume={resume} />
        </main>
    )
}

function AdditionalList({ resume }: { resume: string }) {
    const additionals: Additional[] | null = useAdditionals(resume);

    if (!additionals) return <p>Loading...</p>;

    return (
        <ul>
            {additionals.map((resume) => AdditionalItem(resume))}
        </ul>
    )
}

function AdditionalItem(additional: Additional) {
    return (
        <li key={additional.slug}>
            <a href={`/users/${auth.currentUser?.uid}/additionals/${additional.slug}`}>{additional.slug}</a>
        </li>
    )
}