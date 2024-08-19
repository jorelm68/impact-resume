import { UserContext } from "@/lib/context"
import { AuthCheckProps } from "@/lib/props";
import Link from "next/link";
import { useContext } from "react";
import Text from "./Text";

export default function AuthCheck (props: AuthCheckProps) {
    const { user } = useContext(UserContext);

    return user ? props.children : props.fallback || <h2>You must be signed in</h2>
}