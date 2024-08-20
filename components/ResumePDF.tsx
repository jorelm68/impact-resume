import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { ResumePDFProps } from '@/lib/props';
import { BulletHook, Education, EducationHook, Experience, ExperienceHook, Resume, ResumeHook } from '@/lib/types';
import { useBullet, useEducation, useExperience, useResume } from '@/lib/hooks';
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

    if (!resume || !resumeDocRef) {
        return <Loader />
    }

    let selection: string[] = [];
    if (resume.selected) {
        selection = resume.selected;
    }

    let educations: string[] = [];
    if (resume.educations) {
        educations = resume.educations.filter(slug => selection.includes(slug));
    }
    let experiences: string[] = [];
    if (resume.experiences) {
        experiences = resume.experiences.filter(slug => selection.includes(slug));
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
                {educations.map((educationSlug, index) => {
                    return <EducationSection key={index} index={index} selection={selection} resumeSlug={resumeSlug} educationSlug={educationSlug} />
                })}

                {/* Experience Section */}
                {experiences.map((experienceSlug, index) => {
                    return <ExperienceSection key={index} index={index} selection={selection} resumeSlug={resumeSlug} experienceSlug={experienceSlug} />
                })}

                {/* Additional Section */}
                <AdditionalSection resumeSlug={resumeSlug} resumeDocRef={resumeDocRef} bullets={resume.bullets || []} />
            </Page>
        </Document>
    )
}


function EducationSection({ selection, index, resumeSlug, educationSlug }: { selection: string[], index: number, resumeSlug: string, educationSlug: string }) {
    const { education, educationDocRef }: EducationHook = useEducation(resumeSlug, educationSlug);

    if (!education || !educationDocRef) {
        return <Loader />
    }

    let bullets: string[] = [];
    if (education.bullets) {
        bullets = education.bullets.filter(slug => selection.includes(slug));
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

                    {bullets.map((bulletSlug, index) => {
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

    let bullets: string[] = [];
    if (experience.bullets) {
        bullets = experience.bullets.filter(slug => selection.includes(slug));
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

                    {bullets.map((bulletSlug, index) => {
                        return <BulletSection key={index} resumeSlug={resumeSlug} docRef={experienceDocRef} bulletSlug={bulletSlug} />
                    })}
                </View>

            </View>
        </View>
    )
}

function BulletSection({ resumeSlug, docRef, bulletSlug }: { resumeSlug: string, docRef: DocumentReference<Education | Experience | Resume>, bulletSlug: string }) {
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

function AdditionalSection({ resumeSlug, resumeDocRef, bullets }: { resumeSlug: string, resumeDocRef: DocumentReference<Resume>, bullets: string[] }) {
    return (
        <View style={styles.section}>
            <View style={styles.leftColumn}>
                <Text style={styles.bigCapBold}>ADDITIONAL</Text>
            </View>

            <View style={styles.middleColumn}>
                {bullets.map((bulletSlug, index) => {
                    return <BulletSection key={index} resumeSlug={resumeSlug} docRef={resumeDocRef} bulletSlug={bulletSlug} />
                })}
            </View>
        </View>
    )
}