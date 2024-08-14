import { UserContext } from "@/lib/context";
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
                            <Link href="/resumes">
                                <button className='btn-blue'>My Resumes</button>
                            </Link>
                        </li>

                        <li>
                            <img alt="" src={user.photoURL ? user.photoURL : require('@/public/hacker.png')} />
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