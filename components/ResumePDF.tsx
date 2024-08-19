import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumePDFProps } from '@/lib/props';
import { EducationHook, ExperienceHook, ResumeHook } from '@/lib/types';
import { useEducation, useExperience, useResume } from '@/lib/hooks';
import Loader from './Loader';
import { formatTime } from '@/lib/helper';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 36,
        fontSize: 12,
    },
    fullName: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    contactInfo: {
        fontSize: 11,
        fontWeight: 'normal',
    },
});

export default function ResumePDF({ resumeSlug }: ResumePDFProps) {
    const { resume }: ResumeHook = useResume(resumeSlug);

    if (!resume) {
        return <Loader />
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={styles.fullName}>John Doe</Text>
                    <Text style={styles.contactInfo}>{resume.email} • {resume.phone || ''} • {resume.linkedInURL || ''}</Text>
                </View>

                <View style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginTop: 10,
                    marginBottom: 10,
                }} />

                {/* Education Section */}
                {resume.educations?.map((educationSlug, index) => {
                    return <EducationSection key={index} index={index} resumeSlug={resumeSlug} educationSlug={educationSlug} />
                })}

                {/* Experience Section */}
                {resume.experiences?.map((experienceSlug, index) => {
                    return <ExperienceSection key={index} index={index} resumeSlug={resumeSlug} experienceSlug={experienceSlug} />
                })}


                {/* <View style={styles.section}>
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
                </View> */}

                {/* Leadership and Activities Section */}
                {/* <View style={styles.section}>
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
                </View> */}

                {/* Skills Section */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.item}>
                        <Text>Technical Skills: Microsoft Excel, SQL, Python</Text>
                        <Text>Languages: Spanish (Fluent), French (Conversational)</Text>
                    </View>
                </View> */}
            </Page>
        </Document>
    )
}


function EducationSection({ index, resumeSlug, educationSlug }: { index: number, resumeSlug: string, educationSlug: string }) {
    const { education }: EducationHook = useEducation(resumeSlug, educationSlug);

    if (!education) {
        return <Loader />
    }

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                width: '16%'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 12,
                }}>{index === 0 ? 'EDUCATION' : ''}</Text>
            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'column',
                width: '84%'
            }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 12,
                        textTransform: 'uppercase',
                    }}>{education.school}</Text>
                    <Text style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}>{education.location}</Text>
                </View>
                <Text style={{
                    fontSize: 11,
                    fontWeight: 'bold',
                }}>{education.college}</Text>
                <Text style={{
                    fontSize: 11,
                }}>{education.degree}, {formatTime(education.endDate, 'M, Y')}</Text>
            </View>
        </View>
    )
}

function ExperienceSection({ index, resumeSlug, experienceSlug }: { index: number, resumeSlug: string, experienceSlug: string }) {
    const { experience }: ExperienceHook = useExperience(resumeSlug, experienceSlug);

    if (!experience) {
        return <Loader />
    }

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                width: '16%'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 12,
                }}>{index === 0 ? 'EXPERIENCE' : ''}</Text>
                <Text style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                }}>{formatTime(experience.startDate, 'YYYY') === formatTime(experience.endDate, 'YYYY') ? formatTime(experience.startDate, 'YYYY') : `${formatTime(experience.startDate, 'YYYY')} - ${formatTime(experience.endDate, 'YYYY')}`}</Text>
            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'column',
                width: '84%'
            }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: 12,
                    }}>{experience.organization}</Text>
                    <Text style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}>{experience.location}</Text>
                </View>

                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 11,
                }}>{experience.title}</Text>
            </View>
        </View>
    )
}