import AuthCheck from "@/components/AuthCheck";
import { UpgradeButton } from "@/components/Buttons";
import { auth } from "@/lib/firebase";
import { useUser } from "@/lib/hooks";
import { UserHook } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";


export default function UserPage() {
    const router = useRouter();
    const { user, userDocRef }: UserHook = useUser();

    const handleSignOut = async () => {
        await auth.signOut();
        toast.success('Signed out successfully.');
        router.push(`/enter`);
    }

    if (!user || !userDocRef) {
        return null;
    }

    return (
        <main>
            <AuthCheck fallback={(
                <Link href={`/`}>
                    <button className='btn-blue'>Sign In</button>
                </Link>
            )}>
                <h1>{user.displayName || user.email}</h1>
                <Link href={`/users/${auth.currentUser?.uid}/resumes`}>
                    <button className='btn-blue'>
                        My Resumes
                    </button>
                </Link>

                <UpgradeButton />

                <button onClick={handleSignOut}>Sign Out</button>
            </AuthCheck>
        </main>
    )
}