import View from "../View";

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            backgroundColor: '#fff',
            padding: '16px',
            minWidth: `${400 + 32}px`,
            flexGrow: 1,
        }}>
            {children}
        </View>
    )
}