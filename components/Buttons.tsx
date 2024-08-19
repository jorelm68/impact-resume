import { useEffect, useState } from "react";
import Loader from "./Loader";
import constants from "@/lib/constants";
import { ButtonProps, GenericButtonProps, PDFButtonProps } from "@/lib/props";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "./ResumePDF";
import { auth, manageSubscription, signInWithUmich, upgradeToPremium } from "@/lib/firebase";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { usePremiumStatus } from "@/lib/hooks";

function Button({ onClick, style, children }: GenericButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (onClick) {
            setLoading(true);
            await onClick();
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <button style={{
            margin: '0px',
            height: '24px',
            backgroundColor: 'black',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
            ...style,
        }} onClick={handleClick}>
            {children}
        </button>
    )
}

export function RemoveButton({ onClick }: ButtonProps) {
    return (
        <Button onClick={onClick} style={{
            backgroundColor: 'red',
        }}>
            <span style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
            }}>REMOVE</span>
        </Button>
    )
}

export function AddButton({ onClick }: ButtonProps) {
    return (
        <Button onClick={onClick} style={{
            backgroundColor: constants.colors.lightBlue,
        }}>
            <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
            }}>+</span>
        </Button>
    )
}

export function SaveButton({ onClick }: ButtonProps) {
    return (
        <Button onClick={onClick} style={{
            backgroundColor: 'green',
        }}>
            <span style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
            }}>SAVE</span>
        </Button>
    )
}

export function CancelButton({ onClick }: ButtonProps) {
    return (
        <Button onClick={onClick} style={{
            backgroundColor: 'grey',
        }}>
            <span style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
            }}>CANCEL</span>
        </Button>
    )
}

export function EditButton({ onClick }: ButtonProps) {
    return (
        <Button onClick={onClick} style={{
            backgroundColor: 'black',
        }}>
            <span style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
            }}>EDIT</span>
        </Button>
    )
}

export function PDFButton({ resumeSlug }: PDFButtonProps) {
    const [loading, setLoading] = useState(true);
    const isPremium = usePremiumStatus();

    const handleClick = async () => {
        toast.error('You must be a premium member to download PDFs.');
    }

    if (!isPremium) {
        return (
            <Button style={{
                backgroundColor: 'crimson',
                cursor: 'not-allowed',
            }} onClick={handleClick}>
                <span style={{
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                }}>🔒 PDF</span>
            </Button>
        )
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500)
    }, [])

    if (loading) {
        return <Loader />
    }

    return (
        <PDFDownloadLink document={<ResumePDF resumeSlug={resumeSlug} />} fileName="resume.pdf">
            <Button style={{
                backgroundColro: 'crimson',
            }}>
                <span style={{
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                }}>PDF</span>
            </Button>
        </PDFDownloadLink>
    )
}


export function UpgradeButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpgradeToPremium = async () => {
        setLoading(true);
        try {
            const checkoutUrl = await upgradeToPremium();
            router.push(checkoutUrl);
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    if (loading) {
        return <Loader />
    }

    return <button onClick={handleUpgradeToPremium} className='btn-green'>UPGRADE</button>
}


export function ManageButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleManageSubscription = async () => {
        setLoading(true);
        try {
            const portalUrl = await manageSubscription();
            router.push(portalUrl);
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    if (loading) {
        return <Loader />
    }

    return <button onClick={handleManageSubscription} className='btn-blue'>Manage Subscription</button>
}

export function SignOutButton() {
    const router = useRouter();

    const signOut = async () => {
        await auth.signOut();
        toast.success('Signed out successfully.');
        router.push(`/enter`);
    }

    return (
        <button onClick={signOut}>Sign Out</button>
    )
}

export function SignInButton() {
    const router = useRouter();
  
    const signInWithGoogle = async () => {
      try {
        await signInWithUmich();
        toast.success('Signed in successfully.');
        router.push(`/users/${auth.currentUser?.uid}`);
      } catch (error: any) {
        await auth.signOut();
        toast.error(error.message);
      }
    }
  
    return (
      <button className='btn-google' onClick={signInWithGoogle}>
        <img alt="" src={'/google.webp'} /> Sign in with Google
      </button>
    )
  }