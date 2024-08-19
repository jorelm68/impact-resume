import { useState } from "react";
import Loader from "./Loader";
import constants from "@/lib/constants";
import { ButtonProps } from "@/lib/props";

interface GenericButtonProps {
    onClick?: () => Promise<void> | void;
    backgroundColor?: string;
    children: React.ReactNode;
}

function Button({ onClick, backgroundColor, children }: GenericButtonProps) {
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
            {children}
        </button>
    )
}

export function MinusButton({ onClick }: ButtonProps) {
    return (
        <Button onClick={onClick} backgroundColor='red'>
            <span style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
            }}>REMOVE</span>
        </Button>
    )
}

export function PlusButton({ onClick }: ButtonProps) {
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

export function CheckButton({ onClick }: ButtonProps) {
    return (
        <Button onClick={onClick} backgroundColor='green'>
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
        <Button onClick={onClick} backgroundColor='grey'>
            <span style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
            }}>CANCEL</span>
        </Button>
    )
}