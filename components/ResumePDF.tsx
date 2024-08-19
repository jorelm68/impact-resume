import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumePDFProps } from '@/lib/props';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    section: {
        marginBottom: 10,
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    contactInfo: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    item: {
        marginBottom: 5,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    bulletText: {
        marginLeft: 5,
    },
});

export default function ResumePDF({ resumeSlug }: ResumePDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Text style={styles.header}>John Doe</Text>
                <Text style={styles.contactInfo}>
                    123 Main St, Ann Arbor, MI 48109 | (123) 456-7890 | johndoe@umich.edu
                </Text>

                {/* Education Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    <View style={styles.item}>
                        <Text>University of Michigan - Ross School of Business</Text>
                        <Text>Bachelor of Business Administration, Expected May 2025</Text>
                        <Text>GPA: 3.8/4.0 | Relevant Coursework: Corporate Finance, Marketing, Data Analytics</Text>
                    </View>
                </View>

                {/* Experience Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    <View style={styles.item}>
                        <Text>ABC Company, Ann Arbor, MI</Text>
                        <Text>Marketing Intern, Summer 2023</Text>
                        <View style={styles.bulletPoint}>
                            <Text>•</Text>
                            <Text style={styles.bulletText}>
                                Developed and executed a digital marketing strategy, increasing website traffic by 20%.
                            </Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text>•</Text>
                            <Text style={styles.bulletText}>
                                Conducted market research and presented findings to senior management, leading to a new product launch.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Leadership and Activities Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Leadership and Activities</Text>
                    <View style={styles.item}>
                        <Text>University of Michigan - Business Club</Text>
                        <Text>President, 2022-Present</Text>
                        <View style={styles.bulletPoint}>
                            <Text>•</Text>
                            <Text style={styles.bulletText}>
                                Led a team of 15 members in organizing events and workshops, improving participation by 30%.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Skills Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.item}>
                        <Text>Technical Skills: Microsoft Excel, SQL, Python</Text>
                        <Text>Languages: Spanish (Fluent), French (Conversational)</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}