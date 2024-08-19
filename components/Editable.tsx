import { ChangeEvent, useEffect, useRef, useState } from "react";
import Text from "./Text";
import View from "./View";
import { FieldValue, Timestamp } from "firebase/firestore";
import { formatTime, parseDateStringToTimestamp } from "@/lib/helper";
import { CheckButton, MinusButton } from "./Buttons";

type EditableType = "text" | "timestamp";

interface EditableProps {
    value: string | Timestamp | FieldValue | null;
    label?: string;
    bold?: boolean;
    onSubmit?: (newValue: string | Timestamp | null) => Promise<void> | void;
    onDelete?: () => Promise<void> | void;
    separateLabel?: boolean;
    type?: EditableType;
}

export default function Editable({
    value,
    label,
    bold = false,
    onSubmit,
    onDelete,
    separateLabel = false,
    type = "text",
}: EditableProps) {
    const [newValue, setNewValue] = useState<string>(
        type === "timestamp" && value instanceof Timestamp
            ? formatTime(value, "YYYY-MM-DD")
            : (value as string) || ""
    );
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if (type === "text") {
                const textarea = inputRef.current as HTMLTextAreaElement;
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            }
        }
    }, [isEditing, type]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === "Escape") {
            handleCancel();
        }
    };

    const handleSubmit = async () => {
        let finalValue: string | Timestamp | null = newValue;

        if (type === "timestamp") {
            finalValue = newValue ? parseDateStringToTimestamp(newValue) : null;
        }

        if (onSubmit) await onSubmit(finalValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewValue(
            type === "timestamp" && value instanceof Timestamp
                ? formatTime(value, "YYYY-MM-DD")
                : (value as string) || ""
        );
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setNewValue(e.target.value);
    };

    const displayText = !separateLabel
        ? newValue || label || "Not shown"
        : newValue || "Not shown";

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "16px",
            }}
        >
            {label && separateLabel && (
                <Text
                    style={{
                        fontWeight: "bold",
                        minWidth: "200px",
                    }}
                >
                    {label}
                </Text>
            )}
            {isEditing ? (
                <>
                    {type === "text" ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={newValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onBlur={() => setTimeout(() => handleCancel(), 2000)}
                            style={{
                                padding: "0.5rem",
                                fontSize: "1rem",
                                border: "1px solid #ccc",
                                borderRadius: "0.25rem",
                                width: "100%",
                                height: "100%",
                                resize: "vertical",
                            }}
                        />
                    ) : (
                        <input
                            type="date"
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            value={newValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleCancel}
                            style={{
                                padding: "0.5rem",
                                fontSize: "1rem",
                                border: "1px solid #ccc",
                                borderRadius: "0.25rem",
                                width: "100%",
                            }}
                        />
                    )}
                    {onDelete && <MinusButton onClick={onDelete} />}
                    {onSubmit && <CheckButton onClick={handleSubmit} />}
                </>
            ) : (
                <Text
                    onClick={() => setIsEditing(true)}
                    style={{
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: bold ? "bold" : "normal",
                    }}
                >
                    {displayText}
                </Text>
            )}
        </View>
    );
}
