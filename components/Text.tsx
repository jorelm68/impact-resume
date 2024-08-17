import { TextProps } from "@/lib/props";
import styles from "@/lib/styles";

export default function Text({ children, ...props }: TextProps) {
    return <p {...props} style={{
        ...styles.reset,
        ...props.style,
    }}>{children}</p>
}