import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from "react";
import Text from "./Text";
import View from "./View";
import { FieldValue, Timestamp } from "firebase/firestore";
import { formatTime, parseDateStringToTimestamp } from "@/lib/helper";

interface EditableProps {
    value: string;
    label?: string;
    bold?: boolean;
    onSubmit: (newValue: string) => void | Promise<void>;
    separateLabel?: boolean;
}

export default function Editable({ value, label, bold = false, onSubmit, separateLabel = false }: EditableProps) {
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
            handleCancel();
        }
    };

    const handleSubmit = async () => {
        await onSubmit(newValue);
        setIsEditing(false);
    }

    const handleChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewValue(e.target.value);
    }

    const handleCancel = () => {
        setIsEditing(false);
        setNewValue(value);
    }

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
        }}>
            {label && separateLabel && (
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
                    onBlur={handleCancel}
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
                        fontWeight: bold ? 'bold' : 'normal',
                    }}
                >
                    {value === '' ? separateLabel ? 'Not shown' : label : value}
                </Text>
            )}
        </View>
    );
}

interface EditableTimestampProps {
    value: Timestamp | FieldValue | null;
    label?: string;
    bold?: boolean;
    onSubmit: (newValue: Timestamp) => Promise<void> | void;
    separateLabel?: boolean;
}

export function EditableTimestamp({ value, label, bold = false, onSubmit, separateLabel = false }: EditableTimestampProps) {
    const formattedValue = value ? formatTime(value, 'YYYY-MM-DD') : '';
    const [newValue, setNewValue] = useState<string>(formattedValue);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleSubmit = async () => {
        const newTimestamp = parseDateStringToTimestamp(newValue);
        await onSubmit(newTimestamp);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewValue(formattedValue);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewValue(e.target.value);
    };

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
        }}>
            {label && separateLabel && (
                <Text style={{
                    fontWeight: 'bold',
                    minWidth: '200px',
                }}>{label}</Text>
            )}
            {isEditing ? (
                <input
                    type="date"
                    ref={inputRef}
                    value={newValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSubmit}
                    style={{
                        padding: '0.5rem',
                        fontSize: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '0.25rem',
                        width: '100%',
                    }}
                />
            ) : (
                <Text
                    onClick={() => setIsEditing(true)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: bold ? 'bold' : 'normal',
                    }}
                >
                    {formattedValue === '' ? separateLabel ? 'Not shown' : label : `, ${formatTime(parseDateStringToTimestamp(formattedValue), 'M, Y')}`}
                </Text>
            )}
        </View>
    );
}