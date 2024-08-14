import { Resume } from "./types";

export interface AuthCheckProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export interface ResumesPageProps {
    resumes: Resume[];
}

export interface ResumeFeedProps {
    resumes: Resume[];
}