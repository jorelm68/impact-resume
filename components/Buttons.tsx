import { useState } from "react";
import Loader from "./Loader";
import constants from "@/lib/constants";

function Button({ onClick, backgroundColor, children }: { onClick?: () => Promise<void> | void, backgroundColor?: string, children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (onClick) {
            setLoading(true);
            await onClick();
            setLoading(false);
        }
    }

    return (
        <button style={{
            width: '24px',
            height: '24px',
            backgroundColor: backgroundColor ? backgroundColor : 'black',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
        }} onClick={handleClick}>
            {loading ? <Loader /> : children}
        </button>
    )
}

export function MinusButton({ onClick }: { onClick?: () => Promise<void> | void }) {
    return (
        <Button onClick={onClick} backgroundColor='red'>
            <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
            }}>-</span>
        </Button>
    )
}

export function PlusButton({ onClick }: { onClick?: () => Promise<void> | void }) {
    return (
        <Button onClick={onClick} backgroundColor={constants.colors.lightBlue}>
            <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
            }}>+</span>
        </Button>
    )
}