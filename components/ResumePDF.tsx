import { useResume } from '@/lib/hooks';
import { ResumeHook } from '@/lib/types';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { flexDirection: 'column', padding: 30 },
    section: { marginBottom: 10 },
    text: { fontSize: 12 },
});

interface ResumePDFProps {
    resumeSlug: string;
}

export default function ResumePDF({ resumeSlug }: ResumePDFProps) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!resume || !resumeDocRef) return null;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.text}>Name: {resume.resumeName}</Text>
                </View>
                {/* Add more sections */}
            </Page>
        </Document>
    )
};