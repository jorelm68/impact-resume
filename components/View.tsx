import styles from "@/lib/styles";
import { HTMLProps } from "react";

interface ViewProps extends HTMLProps<HTMLDivElement> {
    children?: React.ReactNode;
    dragHandleProps?: any;
}

export default function View({ children, dragHandleProps, ...rest }: ViewProps) {
    return (
        <div {...rest} style={{
            ...styles.reset,
            ...rest.style,
        }} {...dragHandleProps} >
            {children}
        </div>
    )
}