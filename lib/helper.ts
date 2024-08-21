import { FieldValue, Timestamp } from "firebase/firestore";
import { ContactInfo, Resume, TimeFormat } from "./types";
import toast from "react-hot-toast";

// Format a Timestamp object (firebase) to be displayed as 'Month, Year'
export function formatTime(timestamp: Timestamp | FieldValue | null | number, type: TimeFormat): string {
    if (!timestamp) return 'Present';
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
        });;
    }
    else if (type === 'YYYY-MM-DD') {
        const date = timestamp.toDate();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    else if (type === 'YYYY') {
        return timestamp.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
        });
    }

    else return '';
}


export function parseDateStringToTimestamp(dateString: string): Timestamp {
    const [year, month, day] = dateString.split('-').map(Number);

    try {
        // Create a Date object. Note: Months are zero-based in JavaScript, so subtract 1 from the month.
        const date = new Date(year, month - 1, day);

        // Convert the Date object to a Firebase Timestamp
        return Timestamp.fromDate(date);
    } catch (error: any) {
        toast.error(error.message);
        return Timestamp.now();
    }
}

export const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};


export const contactInformation = (resume: Resume): ContactInfo => {
    const email: string | null = resume.email;
    const linkedInURL: string | null = resume.linkedInURL;
    const address: string | null = resume.address;
    const phone: string | null = resume.phone;

    let numContacts = 0;
    if (email) numContacts++;
    if (linkedInURL) numContacts++;
    if (phone) numContacts++;

    const one = email || phone || linkedInURL || null;
    const two = email ? phone || linkedInURL || null : null;
    const three = email && phone ? linkedInURL || null : null;

    return {
        numContacts,
        one,
        two,
        three,
        hasEmail: !!email,
        hasLinkedInURL: !!linkedInURL,
        hasAddress: !!address,
        hasPhone: !!phone,
    }
}