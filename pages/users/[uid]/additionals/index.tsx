import { auth } from "@/lib/firebase";
import { useAdditionals } from "@/lib/hooks";
import { Additional } from "@/lib/types";

export default function AdditionalsPage() {
    return (
        <main>
            <h1>Additionals</h1>

            <AdditionalList />
        </main>
    )
}

function AdditionalList() {
    const additionals: Additional[] | null = useAdditionals();

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