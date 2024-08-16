import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useContext } from "react";


export default function Navbar() {
    const { user } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className='btn-logo'>HOME</button>
                    </Link>
                </li>

                {user ? (
                    <>
                        <li className='push-left'>
                            <Link href={`/users/${auth.currentUser?.uid}/resumes`}>
                                <button className='btn-blue'>My Resumes</button>
                            </Link>
                        </li>

                        <li>
                            <Link href={`/users/${auth.currentUser?.uid}`}>
                                <img alt="" src={user.photoURL ? user.photoURL : require('@/public/hacker.png')} />
                            </Link>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link href="/enter">
                            <button className='btn-blue'>Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}