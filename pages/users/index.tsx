import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useContext } from "react";


export default function UsersPage() {
    const { user } = useContext(UserContext);

    return (
        <main>
            <h1>Users</h1>
            <ul>
                <li><Link href={`/users/${auth.currentUser?.uid}`}>{user?.email}</Link></li>
            </ul>
        </main>
    )
}