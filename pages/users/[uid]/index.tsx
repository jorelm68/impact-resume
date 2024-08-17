import { auth } from "@/lib/firebase";
import Link from "next/link";


export default function UserPage() {
    return (
        <main>
            <h1>User</h1>
            <ul>
                <li><Link href={`/users/${auth.currentUser?.uid}/resumes`}>Resumes</Link></li>
            </ul>
        </main>
    )
}