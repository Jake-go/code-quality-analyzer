import { Injectable } from '@angular/core';
import { RepoMetrics } from '../models/metrics';
@Injectable({
  providedIn: 'root'
})
export class AnalyzerService {
  analyzeRepository(repoData: any): RepoMetrics {
    const commitDates = repoData.commits.map((commit: any) =>
      new Date(commit.commit.author.date)
    );

    const totalContributors = this.getTotalFromHeader(repoData.contributors.headers.get('link'));
    const totalPRs = this.getTotalFromHeader(repoData.pullRequests.headers.get('link'));


    return {
      repoName: repoData.repoInfo.full_name,
      totalCommits: repoData.commits.length,
      contributors: totalContributors,
      issuesCount: repoData.repoInfo.open_issues_count,
      pullRequestsCount: totalPRs,
      lastActivityDate: new Date(repoData.repoInfo.updated_at),
      languages: this.processLanguages(repoData.languages),
      commitFrequency: this.calculateCommitFrequency(commitDates),
      codeChurn: this.calculateCodeChurn(repoData.commits)
  };
  }

  private getTotalFromHeader(linkHeader: string): number {
    if (!linkHeader) return 0;
    const matches = linkHeader.match(/page=\d+>; rel="last"/);
    if (matches) {
      const total = matches[0].match(/\d+/);
      return total ? parseInt(total[0]) : 0;
    }
    return 0;
  }

  private calculateCommitFrequency(dates: Date[]): number {
    if(dates.length < 2) return 0;
    const daysDiff = (dates[0].getTime() - dates[dates.length - 1].getTime()) / (1000 * 60 * 60 * 24);
    return dates.length / (daysDiff || 1);
  }

  private processLanguages(languages: any): { [key: string]: number } {
    const total: any = Object.values(languages).reduce((a: any, b: any) => a + b, 0);
    const processed = Object.entries(languages)
    .map(([key, value]: [string, any]) => ({
      key,
      percentage: (value / total) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8)
    .reduce((acc, {key, percentage}) => ({
      ...acc,
      [key]: percentage
    }), {});
    return processed;
  }

  private calculateCodeChurn(commits: any[]): number {
    return commits.reduce((churn, commit) => {
      if (commit && commit.stats) {
        return churn + (commit.stats.additions || 0) + (commit.stats.deletions || 0);
      }
      return churn;
    }, 0);
  }
}
