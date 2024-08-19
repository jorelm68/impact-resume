import { useContext } from 'react';
import { UserContext } from '@/lib/context';
import { auth, signInWithUmich } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { SignInButton, SignOutButton } from '@/components/Buttons';

export default function EnterPage({ }) {
  const { user } = useContext(UserContext);

  return (
    <main>
      {user ? <SignOutButton /> : <SignInButton />}
    </main>
  )
}
