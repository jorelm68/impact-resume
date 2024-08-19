import { useResume } from "@/lib/hooks";
import { ResumeHook, SubmitResumeFields, EditableValue } from "@/lib/types";
import { updateDoc, serverTimestamp } from "firebase/firestore";
import Editable from "../Editable";
import Wrapper from "../Layout/Wrapper";
import View from "../View";

export default function ResumePart({ resumeSlug }: { resumeSlug: string }) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!resume || !resumeDocRef) {
        return null;
    }

    const handleSubmit = async (field: SubmitResumeFields, newValue: EditableValue) => {
        await updateDoc(resumeDocRef, {
            [field]: newValue,
            updatedAt: serverTimestamp(),
        });
    };

    return (
        <Wrapper>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                whiteSpace: 'nowrap',
                minWidth: '400px',
                flexGrow: 1,
            }}>
                <Editable label='Full Name' separateLabel value={resume.fullName || ''} onSubmit={(newValue: EditableValue) => handleSubmit('fullName', newValue)} />
                <Editable label='Email' separateLabel value={resume.email || ''} onSubmit={(newValue: EditableValue) => handleSubmit('email', newValue)} />
                <Editable label='LinkedIn (optional)' separateLabel value={resume.linkedInURL || ''} onSubmit={(newValue: EditableValue) => handleSubmit('linkedInURL', newValue)} />
                <Editable label='Address (optional)' separateLabel value={resume.address || ''} onSubmit={(newValue: EditableValue) => handleSubmit('address', newValue)} />
                <Editable label='Phone (optional)' separateLabel value={resume.phone || ''} onSubmit={(newValue: EditableValue) => handleSubmit('phone', newValue)} />
            </View>
        </Wrapper>
    )
}

