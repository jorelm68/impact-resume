import Checkbox from "../Checkbox";
import Dots from "../Dots";
import View from "../View";

export default function Section({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '4px 0px',
            gap: '24px',
            width: '100%',
        }}>
            <Checkbox />
            <Dots />
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'space-between',
            }}>
                {children}
            </View>
        </View>
    )
}