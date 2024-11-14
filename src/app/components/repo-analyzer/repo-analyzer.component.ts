import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { AnalyzerService } from '../../services/analyzer.service';
import { RepoMetrics } from '../../models/metrics';
import { AiAnalyzerService } from '../../services/ai-analyzer.service'; 
import { MetricsDisplayComponent } from '../metrics-display/metrics-display.component';
import { AIInsightsComponent } from '../ai-insights/ai-insights.component'; 
 
@Component({
  selector: 'app-repo-analyzer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MetricsDisplayComponent,
    AIInsightsComponent
  ],
  template: `
    <div class = "container mx-auto p-4">
      <div class = "max-w-xl mx-auto big-white rounded-lg shadow-md p-6">
        <h1 class = "text-2xl font-bold mb-4">GitHub Repository Analyzer</h1>

        <div class = "mb-4">
          <input
            type = "text"
            [(ngModel)] = "repoUrl"
            placeholder = "Enter GitHub repository URL"
            class = "w-full px-3 py-2 border rounded"
          >
        </div>

        <button 
          (click) = "analyzeRepo()"
          class = "w-full bg-blue-500 text-white px-4 py-2 rounded hover: bg-blue-600"
        >
          Analyze Repository
        </button>
        
        <div *ngIf = "loading" class = "mt-4 text-center">
          Analyzing Repository...
        </div>

        <app-metrics-display 
          *ngIf = "metrics"
          [metrics] = "metrics"
        ></app-metrics-display>

        <!-- debug div -->
        <!-- <div *ngIf = "aiAnalysis">
          <p> AI Analysis is present! </p>
          <pre>{{ aiAnalysis | json }}</pre>
        </div> -->
        <app-ai-insights
          *ngIf = "aiAnalysis"
          [analysis] = "aiAnalysis"
          ></app-ai-insights>
      </div>
    </div>
  `
})
export class RepoAnalyzerComponent {
  repoUrl: string = '';
  metrics: RepoMetrics | null = null;
  aiAnalysis: any = null;
  loading: boolean = false;

  constructor(
    private githubService: GithubService,
    private analyzerService: AnalyzerService,
    private aiAnalyzer: AiAnalyzerService
  ) {}

  analyzeRepo() {
    this.loading = true;
    this.metrics = null;
    this.aiAnalysis = null;

    const { owner, repo } = this.parseGitHubUrl(this.repoUrl);
    this.githubService.getRepositoryData(owner, repo)
    .subscribe({
      next: (data) => {
        this.metrics = this.analyzerService.analyzeRepository(data);
        console.log('Metrics:', this.metrics);
        this.aiAnalysis = this.aiAnalyzer.analyzeRepository(this.metrics);
        console.log('AI Analysis:', this.aiAnalysis);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error analyzing repository:', error);
        this.loading = false;
      }
    });
  }
  private parseGitHubUrl(url: string): { owner: string; repo: string } {
    const urlParts = url.replace('https://github.com/', '').split('/');
    return {
      owner: urlParts[0],
      repo: urlParts[1]
    };
  }
}


