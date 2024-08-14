import { UserContext } from "@/lib/context"
import { AuthCheckProps } from "@/lib/props";
import Link from "next/link";
import { useContext } from "react";

export default function AuthCheck (props: AuthCheckProps) {
    const { user } = useContext(UserContext);

    return user ? props.children : props.fallback || <Link href="/enter">You must be signed in</Link>
}