import { ChangeEvent, useEffect, useRef, useState } from "react";
import Text from "./Text";
import View from "./View";
import { FieldValue, Timestamp } from "firebase/firestore";
import { formatTime, parseDateStringToTimestamp } from "@/lib/helper";
import { CancelButton, SaveButton, RemoveButton } from "./Buttons";
import { TimeFormat } from "@/lib/types";
import constants from "@/lib/constants";
import ReactMarkdown from "react-markdown";

type EditableType = "text" | "timestamp";

interface EditableProps {
    disabled?: boolean;
    value: string | Timestamp | FieldValue | null;
    label?: string;
    bold?: boolean;
    header?: boolean;
    onSubmit?: (newValue: string | Timestamp | null) => Promise<void> | void;
    onDelete?: () => Promise<void> | void;
    separateLabel?: boolean;
    type?: EditableType;
    timeFormat?: TimeFormat;
    section?: boolean;
}

export default function Editable({
    section = false,
    disabled = false,
    header = false,
    value,
    label,
    bold = false,
    onSubmit,
    onDelete,
    separateLabel = false,
    type = "text",
    timeFormat = 'M, Y',
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

    const displayText =
        (newValue && type === "timestamp"
            ? formatTime(parseDateStringToTimestamp(newValue), timeFormat)
            : newValue) ||
        (separateLabel ? constants.NOT_SHOWN : label || constants.NOT_SHOWN);

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
                        minWidth: "150px",
                        color: disabled ? "grey" : "inherit",
                    }}
                >
                    {label}
                </Text>
            )}
            {isEditing ? (
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: '8px',
                    flexGrow: 1,
                }}>
                    {type === "text" ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={newValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
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
                            style={{
                                padding: "0.5rem",
                                fontSize: "1rem",
                                border: "1px solid #ccc",
                                borderRadius: "0.25rem",
                                width: "100%",
                            }}
                        />
                    )}
                    <CancelButton onClick={handleCancel} />
                    {onSubmit && <SaveButton onClick={handleSubmit} />}
                    {onDelete && <RemoveButton onClick={onDelete} />}
                </View>
            ) : (
                <>
                    {section ? (
                        <h2 onClick={() => setIsEditing(true)}>{displayText}</h2>
                    ) : (
                        <Text
                            onClick={() => setIsEditing(true)}
                            style={{
                                cursor: "pointer",
                                fontSize: header ? '2rem' : '1rem',
                                fontWeight: bold || header ? "bold" : "normal",
                                color: disabled || [constants.NOT_SHOWN, constants.DEFAULT_BULLET].includes(displayText) ? "grey" : "inherit",
                            }}
                        >
                            <ReactMarkdown>{displayText}</ReactMarkdown>
                        </Text>
                    )}
                </>
            )}
        </View>
    );
}
