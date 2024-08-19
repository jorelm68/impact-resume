import constants from "@/lib/constants";
import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useContext } from "react";
import { SignInButton } from "./Buttons";


export default function Navbar() {
    const { user } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <img alt="" src={constants.photos.logo} />
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
                                <img alt="" src={user.photoURL ? user.photoURL : constants.photos.hacker} />
                            </Link>
                        </li>
                    </>
                ) : (
                    <li>
                        <SignInButton />
                    </li>
                )}
            </ul>

        </nav>
    )
}