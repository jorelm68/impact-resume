import AuthCheck from "@/components/AuthCheck";
import { ManageButton, SignOutButton, UpgradeButton } from "@/components/Buttons";
import Text from "@/components/Text";
import { auth, checkPremium } from "@/lib/firebase";
import { usePremiumStatus, useUser } from "@/lib/hooks";
import { getPremiumStatus } from "@/lib/stripePayment";
import { UserHook } from "@/lib/types";
import { View } from "@react-pdf/renderer";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function UserPage() {
    const router = useRouter();
    const { user, userDocRef }: UserHook = useUser();
    const isPremium = usePremiumStatus();

    const handleSignOut = async () => {
        await auth.signOut();
        toast.success('Signed out successfully.');
        router.push(`/enter`);
    }

    const handleManage = async () => {
        router.push(`/users/${auth.currentUser?.uid}/manage`);
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
                <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '16px',
                }}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16px',
                    }}>
                        <img src={user.photoURL} style={{
                            width: '128px',
                            height: '128px',
                            borderRadius: '64px',
                        }} alt="" />

                        <View style={{
                            display: 'flex',
                            width: '256px',
                            height: '128px',
                            backgroundColor: isPremium ? 'gold' : 'grey',
                            borderRadius: '8px',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: isPremium ? 'bold' : 'normal',
                            }}>{isPremium ? 'Premium Member' : 'Standard Member'}</Text>
                        </View>
                    </View>

                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 24,
                    }}>{user.email}</Text>

                    <Text style={{
                        fontSize: 14,
                    }}>Signed in as {user.displayName}</Text>

                    {isPremium ? (
                        <ManageButton onClick={handleManage} />
                    ) : (
                        <UpgradeButton />
                    )}

                    <SignOutButton onClick={handleSignOut} />
                </View>
            </AuthCheck>
        </main>
    )
}