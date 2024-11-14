import { Injectable } from '@angular/core';
import { RepoMetrics } from '../models/metrics';

interface AIAnalysis {
  codeHealthScore: number;
  maintenanceRisk: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  predictedTrends: {
    commitTrend: string;
    issueResolutionRate: string;
    contributorGrowth: string;
  };
  codeComplexityScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiAnalyzerService {
  analyzeRepository(metrics: RepoMetrics): AIAnalysis {
    // Calculate code health score using weighted metrics
    const codeHealthScore = this.calculateCodeHealthScore(metrics);
    
    // Predict maintenance risk using multiple factors
    const maintenanceRisk = this.predictMaintenanceRisk(metrics);
    
    // Generate AI-driven recommendations
    const recommendations = this.generateRecommendations(metrics, codeHealthScore, maintenanceRisk);
    
    // Predict repository trends
    const predictedTrends = this.predictTrends(metrics);
    
    // Calculate code complexity score
    const codeComplexityScore = this.analyzeCodeComplexity(metrics);

    return {
      codeHealthScore,
      maintenanceRisk,
      recommendations,
      predictedTrends,
      codeComplexityScore
    };
  }

  private calculateCodeHealthScore(metrics: RepoMetrics): number {
    // Weighted factors for health score calculation
    const weights = {
      commitFrequency: 0.25,
      contributorRatio: 0.2,
      issueResolutionRate: 0.15,
      codeChurn: 0.2,
      prRate: 0.2
    };

    const commitFrequencyScore = this.normalize(metrics.commitFrequency, 0, 10) * weights.commitFrequency;
    const contributorScore = this.normalize(metrics.contributors, 1, 100) * weights.contributorRatio;
    const issueScore = (metrics.issuesCount > 0 ? 
      metrics.pullRequestsCount / metrics.issuesCount : 1) * weights.issueResolutionRate;
    const churnScore = (1 - this.normalize(metrics.codeChurn, 0, 1000000)) * weights.codeChurn;
    const prScore = this.normalize(metrics.pullRequestsCount, 0, 1000) * weights.prRate;

    return (commitFrequencyScore + contributorScore + issueScore + churnScore + prScore) * 100;
  }

  private predictMaintenanceRisk(metrics: RepoMetrics): 'Low' | 'Medium' | 'High' {
    // Risk factors analysis
    const riskFactors = {
      highChurn: metrics.codeChurn > 500000,
      lowCommitFrequency: metrics.commitFrequency < 0.5,
      highIssueRatio: (metrics.issuesCount / (metrics.totalCommits || 1)) > 0.1,
      lowContributors: metrics.contributors < 10,
      inactivity: (new Date().getTime() - metrics.lastActivityDate.getTime()) / (1000 * 60 * 60 * 24) > 30
    };

    const riskScore = Object.values(riskFactors).filter(Boolean).length;
    
    if (riskScore <= 1) return 'Low';
    if (riskScore <= 3) return 'Medium';
    return 'High';
  }

  private generateRecommendations(
    metrics: RepoMetrics, 
    healthScore: number, 
    risk: 'Low' | 'Medium' | 'High'
  ): string[] {
    const recommendations: string[] = [];

    // Dynamic recommendations based on metrics analysis
    if (metrics.commitFrequency < 1) {
      recommendations.push("Increase commit frequency to improve code velocity");
    }

    if (metrics.contributors < 10) {
      recommendations.push("Consider expanding contributor base to enhance project sustainability");
    }

    if (metrics.codeChurn > 500000) {
      recommendations.push("High code churn detected - consider code stabilization sprint");
    }

    if (metrics.issuesCount > metrics.pullRequestsCount * 2) {
      recommendations.push("Issue resolution rate needs improvement - consider dedicating more resources");
    }

    // Language-specific recommendations
    const primaryLanguage = Object.entries(metrics.languages)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    recommendations.push(`Leverage ${primaryLanguage}'s best practices for optimal performance`);

    return recommendations;
  }

  private predictTrends(metrics: RepoMetrics): {
    commitTrend: string;
    issueResolutionRate: string;
    contributorGrowth: string;
  } {
    // Use time-series analysis patterns to predict trends
    const commitTrend = this.analyzeTrend(metrics.commitFrequency, 1.0);
    const issueResolutionRate = this.analyzeTrend(
      metrics.pullRequestsCount / (metrics.issuesCount || 1),
      0.7
    );
    const contributorGrowth = this.predictGrowth(metrics.contributors);

    return {
      commitTrend,
      issueResolutionRate,
      contributorGrowth
    };
  }

  private analyzeCodeComplexity(metrics: RepoMetrics): number {
    // Simulate complexity analysis using available metrics
    const baseComplexity = this.normalize(metrics.codeChurn, 0, 1000000) * 50;
    const languageComplexity = Object.keys(metrics.languages).length * 10;
    const contributorComplexity = this.normalize(metrics.contributors, 1, 100) * 20;
    
    return Math.min(100, baseComplexity + languageComplexity + contributorComplexity);
  }

  private normalize(value: number, min: number, max: number): number {
    return Math.min(1, Math.max(0, (value - min) / (max - min)));
  }

  private analyzeTrend(value: number, threshold: number): string {
    if (value > threshold) return "Increasing";
    if (value < threshold * 0.5) return "Decreasing";
    return "Stable";
  }

  private predictGrowth(contributors: number): string {
    if (contributors < 10) return "High Growth Potential";
    if (contributors < 50) return "Moderate Growth Expected";
    return "Stable Community";
  }
}
