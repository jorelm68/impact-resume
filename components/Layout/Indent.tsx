import View from "../View";

export default function Indent({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            paddingLeft: '1rem',
        }}>
            {children}
        </View>
    )
}