import { FieldValue, Timestamp } from "firebase/firestore";

// Format a Timestamp object (firebase) to be displayed as 'Month, Year'
export function formatTime(timestamp: Timestamp | FieldValue | null | number, type: 'M, Y' | 'H:M(am/pm) M D, Y'): string {
    if (!timestamp) return '';
    if (typeof timestamp === 'number') {
        timestamp = Timestamp.fromMillis(timestamp);
    }
    if (timestamp instanceof FieldValue) return '';

    if (type === 'H:M(am/pm) M D, Y') {
        return timestamp.toDate().toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }
    else if (type === 'M, Y') {
        return timestamp.toDate().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        });
    }

    else return '';
}
