import { useContext } from 'react';
import { UserContext } from '@/lib/context';
import { auth, signInWithUmich } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { SignOutButton } from '@/components/Buttons';

export default function EnterPage({ }) {
  const { user } = useContext(UserContext);

  return (
    <main>
      {user ? <SignOutButton /> : <SignInButton />}
    </main>
  )
}

function SignInButton() {
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

