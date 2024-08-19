import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { ResumePDFProps } from '@/lib/props';
import { Additional, AdditionalHook, BulletHook, Education, EducationHook, Experience, ExperienceHook, ResumeHook } from '@/lib/types';
import { useAdditional, useBullet, useEducation, useExperience, useResume } from '@/lib/hooks';
import Loader from './Loader';
import { formatTime } from '@/lib/helper';
import { DocumentReference } from 'firebase/firestore';

// Register custom fonts
Font.register({
    family: 'Calibri',
    fonts: [
        { src: '/fonts/calibri-regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/calibri-bold.ttf', fontWeight: 'bold' },
    ],
});

// Create styles
const styles = StyleSheet.create({
    page: {
        paddingLeft: 47.75,
        paddingRight: 47.75,
        paddingTop: 43.8,
        paddingBottom: 43.8,
        fontSize: 12,
        fontFamily: 'Calibri',
        lineHeight: 1,
    },
    fullName: {
        fontSize: 15,
        lineHeight: 1,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        overflowWrap: 'normal',
        wordBreak: 'normal',
        hyphens: 'none',
    },
    contactInfo: {
        fontSize: 11,
        lineHeight: 1,
        fontWeight: 'normal',
        overflowWrap: 'normal',
        wordBreak: 'normal',
        hyphens: 'none',
    },

    bigCapBold: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        overflowWrap: 'normal',
        wordBreak: 'normal',
        hyphens: 'none',
    },
    bigBold: {
        fontSize: 12,
        fontWeight: 'bold',
        overflowWrap: 'normal',
        wordBreak: 'normal',
        hyphens: 'none',
    },
    mediumBold: {
        fontSize: 11,
        fontWeight: 'bold',
        overflowWrap: 'normal',
        wordBreak: 'normal',
        hyphens: 'none',
    },
    medium: {
        fontSize: 11,
        fontWeight: 'normal',
        overflowWrap: 'normal',
        wordBreak: 'normal',
        hyphens: 'none',
    },
    bulletPoint: {
        fontSize: 12.5,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },

    leftColumn: {
        display: 'flex',
        flexDirection: 'column',
        width: '16%'
    },
    middleColumn: {
        display: 'flex',
        flexDirection: 'column',
        width: '84%'
    },

    separatedRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    row: {
        display: 'flex',
        flexDirection: 'row',
    },

    section: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8,
    },

    truncate: {
        width: '95%',
    },

    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerDivider: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 2,
        marginBottom: 2,
    },
});

function BulletPoint(): JSX.Element {
    return (
        <Text style={styles.bulletPoint}>•</Text>
    )
}

export default function ResumePDF({ resumeSlug }: ResumePDFProps) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);

    if (!resume || !resume.additionals) {
        return <Loader />
    }

    return (
        <Document>
            <Page size='LETTER' style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.fullName}>{resume.fullName}</Text>
                    <Text style={styles.contactInfo}>{resume.email} {<BulletPoint />} {resume.phone || ''} {<BulletPoint />} {<Link href={resume.linkedInURL || ''}>{resume.linkedInURL?.split('www.')[1]}</Link>}</Text>
                </View>

                <View style={styles.headerDivider} />

                {/* Education Section */}
                {resume.educations?.map((educationSlug, index) => {
                    return <EducationSection key={index} index={index} selection={resume.selected || []} resumeSlug={resumeSlug} educationSlug={educationSlug} />
                })}

                {/* Experience Section */}
                {resume.experiences?.map((experienceSlug, index) => {
                    return <ExperienceSection key={index} index={index} selection={resume.selected || []} resumeSlug={resumeSlug} experienceSlug={experienceSlug} />
                })}

                {/* Additional Section */}
                <AdditionalSection resumeSlug={resumeSlug} additionalSlug={resume.additionals[0]} />

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


function EducationSection({ selection, index, resumeSlug, educationSlug }: { selection: string[], index: number, resumeSlug: string, educationSlug: string }) {
    const { education, educationDocRef }: EducationHook = useEducation(resumeSlug, educationSlug);

    if (!education || !educationDocRef) {
        return <Loader />
    }

    return (
        <View style={styles.section}>
            <View style={styles.leftColumn}>
                <Text style={styles.bigCapBold}>{index === 0 ? 'EDUCATION' : ''}</Text>
            </View>

            <View style={styles.middleColumn}>
                <View style={styles.separatedRow}>
                    <Text style={styles.bigCapBold}>{education.school}</Text>
                    <Text style={styles.mediumBold}>{education.location}</Text>
                </View>

                <View style={styles.truncate}>
                    <Text style={styles.mediumBold}>{education.college}</Text>
                    <Text style={styles.medium}>{education.degree}, {formatTime(education.endDate, 'M, Y')}</Text>

                    {education.bullets?.filter(slug => selection.includes(slug)).map((bulletSlug, index) => {
                        return <BulletSection key={index} resumeSlug={resumeSlug} docRef={educationDocRef} bulletSlug={bulletSlug} />
                    })}
                </View>
            </View>
        </View>
    )
}

function ExperienceSection({ selection, index, resumeSlug, experienceSlug }: { selection: string[], index: number, resumeSlug: string, experienceSlug: string }) {
    const { experience, experienceDocRef }: ExperienceHook = useExperience(resumeSlug, experienceSlug);

    if (!experience || !experienceDocRef) {
        return <Loader />
    }

    return (
        <View style={styles.section}>
            <View style={styles.leftColumn}>
                <Text style={styles.bigCapBold}>{index === 0 ? 'EXPERIENCE' : ''}</Text>
                <Text style={styles.bigCapBold}>{formatTime(experience.startDate, 'YYYY') === formatTime(experience.endDate, 'YYYY') ? formatTime(experience.startDate, 'YYYY') : `${formatTime(experience.startDate, 'YYYY')}-${formatTime(experience.endDate, 'YYYY')}`}</Text>
            </View>

            <View style={styles.middleColumn}>
                <View style={styles.separatedRow}>
                    <Text style={styles.bigCapBold}>{experience.organization}</Text>
                    <Text style={styles.mediumBold}>{experience.location}</Text>
                </View>

                <View style={styles.truncate}>
                    <Text style={styles.mediumBold}>{experience.title}</Text>

                    {experience.bullets?.filter(slug => selection.includes(slug)).map((bulletSlug, index) => {
                        return <BulletSection key={index} resumeSlug={resumeSlug} docRef={experienceDocRef} bulletSlug={bulletSlug} />
                    })}
                </View>

            </View>
        </View>
    )
}

function BulletSection({ resumeSlug, docRef, bulletSlug }: { resumeSlug: string, docRef: DocumentReference<Education | Experience | Additional>, bulletSlug: string }) {
    const { bullet }: BulletHook = useBullet(resumeSlug, docRef, bulletSlug);

    if (!bullet) {
        return <Loader />
    }

    return (
        <View style={styles.row}>
            <BulletPoint />
            <Text style={styles.medium}>{' '}</Text>
            <Text style={styles.medium}>{bullet.text}</Text>
        </View>
    )
}

function AdditionalSection({ resumeSlug, additionalSlug }: { resumeSlug: string, additionalSlug: string }) {
    const { additional, additionalDocRef }: AdditionalHook = useAdditional(resumeSlug, additionalSlug);

    if (!additional || !additionalDocRef) {
        return <Loader />
    }

    return (
        <View style={styles.section}>
            <View style={styles.leftColumn}>
                <Text style={styles.bigCapBold}>ADDITIONAL</Text>
            </View>

            <View style={styles.middleColumn}>
                {additional.bullets?.map((bulletSlug, index) => {
                    return <BulletSection key={index} resumeSlug={resumeSlug} docRef={additionalDocRef} bulletSlug={bulletSlug} />
                })}
            </View>
        </View>
    )
}