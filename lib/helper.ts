import { FieldValue, Timestamp } from "firebase/firestore";
import { TimeFormat } from "./types";

// Format a Timestamp object (firebase) to be displayed as 'Month, Year'
export function formatTime(timestamp: Timestamp | FieldValue | null | number, type: TimeFormat): string {
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
    else if (type === 'YYYY-MM-DD') {
        const date = timestamp.toDate();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    else return '';
}


export function parseDateStringToTimestamp(dateString: string): Timestamp {
    const [year, month, day] = dateString.split('-').map(Number);

    // Create a Date object. Note: Months are zero-based in JavaScript, so subtract 1 from the month.
    const date = new Date(year, month - 1, day);

    // Convert the Date object to a Firebase Timestamp
    return Timestamp.fromDate(date);
}