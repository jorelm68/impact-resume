import { SectionProps } from "@/lib/props";
import Checkbox from "../Checkbox";
import Dots from "../Dots";
import View from "../View";

export default function Section({ children, isSelected, onToggleSelect, dragHandleProps }: SectionProps) {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '4px 0px',
            gap: '24px',
            width: '100%',
        }}>
            <Checkbox isChecked={isSelected} onChange={onToggleSelect}/>
            <Dots dragHandleProps={dragHandleProps} />
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