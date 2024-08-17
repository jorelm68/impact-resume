import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ResumePage() {
    return (
        <main>
            <h1>Resume</h1>
            <ul>
                <li><Link href={`/users/${auth.currentUser?.uid}/experiences`}>Experiences</Link></li>
                <li><Link href={`/users/${auth.currentUser?.uid}/educations`}>Educations</Link></li>
                <li><Link href={`/users/${auth.currentUser?.uid}/additionals`}>Additionals</Link></li>
            </ul>
        </main>
    )
}