import AuthCheck from "@/components/AuthCheck";
import { auth, upgradeAccount } from "@/lib/firebase";
import { useUser } from "@/lib/hooks";
import { getCheckoutUrl } from "@/lib/stripePayment";
import { User, UserHook } from "@/lib/types";
import { DocumentReference } from "firebase/firestore";
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

    const handleUpgradeAccount = async () => {
        const checkoutUrl = await upgradeAccount();
        router.push(checkoutUrl);
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

                <button onClick={handleUpgradeAccount} className='btn-blue'>
                    Upgrade Account
                </button>

                <button onClick={handleSignOut}>Sign Out</button>
            </AuthCheck>
        </main>
    )
}