import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from "react";
import Text from "./Text";
import View from "./View";

interface EditableProps {
    value: string;
    label?: string;
    onSubmit: (newValue: string) => void | Promise<void>;
}

export default function Editable({ value, label, onSubmit }: EditableProps) {
    const [newValue, setNewValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.focus();
            // Move cursor to the end of the text
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }, [isEditing]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setNewValue(value);
        }
    };

    const handleSubmit = async () => {
        await onSubmit(newValue);
        setIsEditing(false);
    }

    const handleChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewValue(e.target.value);
    }

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
                    ref={textareaRef}
                    value={newValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
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
                    {value === '' ? 'Not shown' : value}
                </Text>
            )}
        </View>
    );
}
