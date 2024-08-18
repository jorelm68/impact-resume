import { ChangeEventHandler, useState } from "react"
import Text from "./Text";
import View from "./View";

interface EditableProps {
    value: string;
    label?: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

export default function Editable({ value, label, onChange }: EditableProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
        }}>
            {label && (
                <Text style={{
                    fontWeight: 'bold',
                    minWidth: '200px',
                }}>{label}</Text>
            )}
            {isEditing ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    onBlur={() => setIsEditing(false)}
                    style={{
                        padding: '0.5rem',
                        fontSize: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '0.25rem',
                        width: '100%',
                        height: '100%',
                        resize: 'vertical', // Allows the user to resize the textarea vertically
                    }}
                />
            ) : (
                <Text
                    onClick={() => setIsEditing(true)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    {value === '' ? 'Click to add' : value}
                </Text>
            )}
        </View>
    )
}