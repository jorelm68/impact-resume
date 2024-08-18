import View from "../View";

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            padding: '16px',
            minWidth: `${400 + 32}px`,
        }}>
            {children}
        </View>
    )
}