import { useContext } from 'react';
import { UserContext } from '@/lib/context';
import { auth, signInWithUmich } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function EnterPage({ }) {
  const { user } = useContext(UserContext);

  return (
    <main>
      {user ? <SignOutButton /> : <SignInButton />}
    </main>
  )
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithUmich();
      toast.success('Signed in successfully.');
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

function SignOutButton() {
  const signOut = async () => {
    await auth.signOut();
    toast.success('Signed out successfully.');
  }

  return (
    <button onClick={signOut}>Sign Out</button>
  )
}