export interface RepoMetrics {
    repoName: string;
    totalCommits: number;
    contributors: number;
    issuesCount: number;
    pullRequestsCount: number;
    lastActivityDate: Date;
    languages: { [key: string]: number };
    commitFrequency: number;
    codeChurn: number;
}
