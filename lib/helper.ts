import { FieldValue, Timestamp } from "firebase/firestore";

// Format a Date object to be displayed as 'Month, Year'
export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
}

// Format a Timestamp object (firebase) to be displayed as 'Month, Year'
export function formatTimestamp(timestamp: Timestamp): string {
    return formatDate(timestamp.toDate());
}