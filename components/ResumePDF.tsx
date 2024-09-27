import React, { Fragment } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { ResumePDFProps } from '@/lib/props';
import { BulletHook, ContactInfo, EducationHook, ExperienceHook, ProjectHook, ResumeHook, SectionHook } from '@/lib/types';
import { useBullet, useEducation, useExperience, useProject, useResume, useSection } from '@/lib/hooks';
import { contactInformation, formatTime } from '@/lib/helper';
import { DocumentData, DocumentReference } from 'firebase/firestore';

// Register custom fonts
Font.register({
    family: 'Calibri',
    fonts: [
        { src: '/fonts/calibri-regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/calibri-bold.ttf', fontWeight: 'bold' },
        { src: '/fonts/calibri-italic.ttf', fontStyle: 'italic' },
    ],
});

function processBold(text: string): React.ReactNode[] {
    const boldRegex = /\*\*(.+?)\*\*/;
    const elements: React.ReactNode[] = [];
    let remainingText = text;

    while (remainingText) {
        const boldMatch = remainingText.match(boldRegex);

        if (boldMatch) {
            const matchIndex = boldMatch.index!;
            const matchLength = boldMatch[0].length;

            // Add the text before the match (if any)
            if (matchIndex > 0) {
                elements.push(remainingText.slice(0, matchIndex));
            }

            // Handle the matched bold text
            elements.push(
                <Text key={elements.length} style={{ fontWeight: 'bold' }}>
                    {boldMatch[1]}
                </Text>
            );

            // Update the remaining text to process
            remainingText = remainingText.slice(matchIndex + matchLength);
        } else {
            // No more matches, push the remaining text
            elements.push(remainingText);
            remainingText = '';
        }
    }

    return elements;
}
function processLinks(text: string): React.ReactNode[] {
    const linkRegex = /\[(.*?)\]\((.*?)\)/;
    const elements: React.ReactNode[] = [];
    let remainingText = text;

    while (remainingText) {
        const linkMatch = remainingText.match(linkRegex);

        if (linkMatch) {
            const matchIndex = linkMatch.index!;
            const matchLength = linkMatch[0].length;

            // Add the text before the match (if any)
            if (matchIndex > 0) {
                elements.push(remainingText.slice(0, matchIndex));
            }

            // Handle the matched link
            elements.push(
                <Link key={elements.length} src={linkMatch[2]}>
                    {linkMatch[1]}
                </Link>
            );

            // Update the remaining text to process
            remainingText = remainingText.slice(matchIndex + matchLength);
        } else {
            // No more matches, push the remaining text
            elements.push(remainingText);
            remainingText = '';
        }
    }

    return elements;
}


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

function BulletPoint({ noSpace = false }: { noSpace?: boolean }): JSX.Element {
    return (
        <Text style={styles.bulletPoint}>{noSpace ? '' : ' '}•{noSpace ? '' : ' '}</Text>
    )
}

export default function ResumePDF({ resumeSlug }: ResumePDFProps) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    if (!resume || !resumeDocRef) return null;

    const contactInfo: ContactInfo = contactInformation(resume);

    return (
        <Document>
            <Page size='LETTER' style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.fullName}>{resume.fullName}</Text>
                    {contactInfo.hasAddress ? <Text style={styles.contactInfo}>{resume.address}</Text> : null}
                    <Text style={styles.contactInfo}>
                        {contactInfo.numContacts >= 1 ? contactInfo.one?.includes('http') ? <Link href={resume.linkedInURL || ''}>{resume.linkedInURL?.split('www.')[1]}</Link> : contactInfo.one : ''}
                        {contactInfo.numContacts >= 2 ? <BulletPoint /> : ''}
                        {contactInfo.numContacts >= 2 ? contactInfo.two?.includes('http') ? <Link href={resume.linkedInURL || ''}>{resume.linkedInURL?.split('www.')[1]}</Link> : contactInfo.two : ''}
                        {contactInfo.numContacts === 3 ? <BulletPoint /> : ''}
                        {contactInfo.numContacts === 3 ? contactInfo.three?.includes('http') ? <Link href={resume.linkedInURL || ''}>{resume.linkedInURL?.split('www.')[1]}</Link> : contactInfo.three : ''}
                    </Text>
                </View>

                <View style={styles.headerDivider} />

                {resume.sections.map((sectionName, index) => {
                    return (
                        <View style={{
                            display: 'flex',
                            paddingTop: index === 0 ? '0px' : '4px',
                            paddingBottom: index === resume.sections.length - 1 ? '0px' : '4px',
                            borderBottom: index >= resume.sections.length - 1 ? undefined : '1px solid black',
                        }}>
                            <Section key={index} resumeSlug={resumeSlug} sectionName={sectionName} />
                        </View>
                    )
                })}
            </Page>
        </Document>
    )
}

function Section({ resumeSlug, sectionName }: { resumeSlug: string, sectionName: string }) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    if (!resume || !resumeDocRef) return null;

    let list = sectionName === 'Education'
        ? resume.educations.filter(slug => resume.selected.includes(slug))
        : sectionName === 'Projects'
            ? resume.projects.filter(slug => resume.selected.includes(slug))
            : resume.experiences.filter(slug => resume.selected.includes(slug));

    if (sectionName === 'Education') {
        return list.map((educationSlug, index) => {
            return <EducationSection key={index} index={index} resumeSlug={resumeSlug} educationSlug={educationSlug} />
        })
    } else if (sectionName === 'Experience') {
        return list.map((experienceSlug, index) => {
            return <ExperienceSection key={index} index={index} resumeSlug={resumeSlug} experienceSlug={experienceSlug} />
        })
    } else if (sectionName === 'Projects') {
        return list.map((projectSlug, index) => {
            return <ProjectSection key={index} index={index} resumeSlug={resumeSlug} projectSlug={projectSlug} />
        })
    } else {
        return <OtherSection resumeSlug={resumeSlug} sectionName={sectionName} />
    }
}


function EducationSection({ index, resumeSlug, educationSlug }: { index: number, resumeSlug: string, educationSlug: string }) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    const { education, educationDocRef }: EducationHook = useEducation(resumeSlug, educationSlug);
    if (!resume || !resumeDocRef || !education || !educationDocRef) return null;

    const list = education.bullets.filter(slug => resume.selected.includes(slug));

    return (
        <View style={{
            ...styles.section,
            paddingTop: index === 0 ? '0px' : '4px',
        }}>
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
                    <Text style={styles.medium}>{education.degree}{education.degree && formatTime(education.endDate, 'M, Y') ? ', ' : ''}{formatTime(education.endDate, 'M, Y')}</Text>

                    {list.map((bulletSlug, index) => {
                        return <BulletSection key={index} docRef={educationDocRef} bulletSlug={bulletSlug} />
                    })}
                </View>
            </View>
        </View>
    )
}

function ExperienceSection({ index, resumeSlug, experienceSlug }: { index: number, resumeSlug: string, experienceSlug: string }) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    const { experience, experienceDocRef }: ExperienceHook = useExperience(resumeSlug, experienceSlug);
    if (!resume || !resumeDocRef || !experience || !experienceDocRef) return null;

    const list = experience.bullets.filter(slug => resume.selected.includes(slug));

    return (
        <View style={{
            ...styles.section,
            paddingTop: index === 0 ? '0px' : '4px',
        }}>
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

                    {list.map((bulletSlug, index) => {
                        return <BulletSection key={index} docRef={experienceDocRef} bulletSlug={bulletSlug} />
                    })}
                </View>

            </View>
        </View>
    )
}

function ProjectSection({ index, resumeSlug, projectSlug }: { index: number, resumeSlug: string, projectSlug: string }) {
    const { resume, resumeDocRef }: ResumeHook = useResume(resumeSlug);
    const { project, projectDocRef }: ProjectHook = useProject(resumeSlug, projectSlug);
    if (!resume || !resumeDocRef || !project || !projectDocRef) return null;

    const list = project.bullets.filter(slug => resume.selected.includes(slug));

    return (
        <View style={{
            ...styles.section,
            paddingTop: index === 0 ? '0px' : '4px',
        }}>
            <View style={styles.leftColumn}>
                <Text style={styles.bigCapBold}>{index === 0 ? 'PROJECTS' : ''}</Text>
            </View>

            <View style={styles.middleColumn}>
                <View style={styles.separatedRow}>
                    <View style={styles.row}>
                        {project.link && (
                            <Link src={project.link} style={{
                                ...styles.bigCapBold,
                                textDecoration: 'none',
                            }}>{project.name} </Link>
                        )}
                        {!project.link && (
                            <Text style={styles.bigCapBold}>{project.name} </Text>
                        )}
                        {project.languages && (
                            <Text style={styles.medium}>{'|'}</Text>
                        )}
                        {project.languages && (
                            <Text style={{
                                ...styles.medium,
                                fontStyle: 'italic',
                            }}> {project.languages}</Text>
                        )}
                    </View>

                    {project.github && (
                        <View style={styles.row}>
                            <Text style={styles.mediumBold}>GitHub: </Text>
                            <Link src={project.github} style={styles.medium}>
                                Front-End
                            </Link>
                            {project.github2 && (
                                <Text style={styles.medium}>{', '}</Text>
                            )}
                            {project.github2 && (
                                <Link src={project.github2} style={styles.medium}>
                                    Back-End
                                </Link>
                            )}
                        </View>
                    )}
                </View>

                <View style={styles.truncate}>
                    {project.techStack && (
                        <Text style={{
                            ...styles.medium,
                            fontStyle: 'italic',
                        }}>
                            {project.techStack}
                        </Text>
                    )}

                    {list.map((bulletSlug, index) => {
                        return <BulletSection key={index} docRef={projectDocRef} bulletSlug={bulletSlug} />
                    })}
                </View>

            </View>
        </View>
    )
}

function OtherSection({ resumeSlug, sectionName }: { resumeSlug: string, sectionName: string }) {
    const { resume }: ResumeHook = useResume(resumeSlug);
    const { section, sectionDocRef }: SectionHook = useSection(resumeSlug, sectionName);
    if (!resume || !section || !sectionDocRef) return null;

    return (
        <View style={styles.section}>
            <View style={styles.leftColumn}>
                <Text style={styles.bigCapBold}>{section.name}</Text>
            </View>

            <View style={styles.middleColumn}>
                <View style={styles.truncate}>
                    {section.bullets.map((bulletSlug, index) => {
                        return <BulletSection key={index} docRef={sectionDocRef} bulletSlug={bulletSlug} />
                    })}
                </View>
            </View>
        </View>
    )
}

function BulletSection({ docRef, bulletSlug }: { docRef: DocumentReference<DocumentData>, bulletSlug: string }) {
    const { bullet }: BulletHook = useBullet(docRef, bulletSlug);
    if (!bullet) return null;

    return (
        <View style={styles.row}>
            <BulletPoint noSpace />
            <Text style={styles.medium}>{' '}</Text>
            {parseMarkdown(bullet.text)}
        </View>
    )
}

export function parseMarkdown(text: string) {
    const elements: React.ReactNode[] = [];
    let remainingText = text;

    // Regular expressions for bold text, links, and combined bold links
    const boldRegex = /\*\*(.+?)\*\*/;
    const linkRegex = /\[(.+?)\]\((.+?)\)/;
    const combinedBoldLinkRegex = /\*\*\[(.+?)\]\((.+?)\)\*\*/;

    while (remainingText) {
        const boldMatch = remainingText.match(boldRegex);
        const linkMatch = remainingText.match(linkRegex);
        const combinedBoldLinkMatch = remainingText.match(combinedBoldLinkRegex);

        // Find the first match (if any)
        const firstMatch = [combinedBoldLinkMatch, boldMatch, linkMatch].filter(Boolean).sort(
            (a, b) => (a!.index! - b!.index!)
        )[0];

        if (firstMatch) {
            const matchIndex = firstMatch.index!;
            const matchLength = firstMatch[0].length;

            // Add the text before the match (if any)
            if (matchIndex > 0) {
                elements.push(
                    <Text key={elements.length} style={styles.medium}>{remainingText.slice(0, matchIndex)}</Text>
                );
            }

            // Handle the matched combined bold link text
            if (firstMatch === combinedBoldLinkMatch) {
                elements.push(
                    <Link key={elements.length} src={combinedBoldLinkMatch[2]} style={{ ...styles.medium, fontWeight: 'bold' }}>
                        {combinedBoldLinkMatch[1]}
                    </Link>
                );
                elements.push(
                    <Text key={elements.length} style={styles.medium}>
                        {' '}
                    </Text>
                );
            }
            // Handle the matched bold text
            else if (firstMatch === boldMatch) {
                elements.push(
                    <Text key={elements.length} style={{ ...styles.medium, fontWeight: 'bold' }}>
                        {boldMatch[1]}
                    </Text>
                );
                elements.push(
                    <Text key={elements.length} style={styles.medium}>
                        {' '}
                    </Text>
                );
            }
            // Handle the matched link
            else if (firstMatch === linkMatch) {
                elements.push(
                    <Link key={elements.length} src={linkMatch[2]} style={styles.medium}>
                        {linkMatch[1]}
                    </Link>
                );
                elements.push(
                    <Text key={elements.length} style={styles.medium}>
                        {' '}
                    </Text>
                );
            }

            // Update the remaining text to process
            remainingText = remainingText.slice(matchIndex + matchLength);
        } else {
            // No more matches, push the remaining text
            elements.push(<Text key={elements.length} style={styles.medium}>{remainingText}</Text>);
            remainingText = '';
        }
    }

    return elements;
}