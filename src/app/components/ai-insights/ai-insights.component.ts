import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-6 bg-white rounded-lg shadow p-6" *ngIf="analysis">
      <h2 class="text-xl font-bold mb-4">AI-Powered Insights</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-lg mb-2">Repository Health</h3>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold">{{analysis.codeHealthScore.toFixed(1)}}</span>
              <span class="px-3 py-1 rounded-full text-white"
                [ngClass]="{
                  'bg-green-500': analysis.codeHealthScore > 75,
                  'bg-yellow-500': analysis.codeHealthScore > 50 && analysis.codeHealthScore <= 75,
                  'bg-red-500': analysis.codeHealthScore <= 50
                }">
                {{analysis.maintenanceRisk}} Risk
              </span>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-lg mb-2">Predicted Trends</h3>
            <ul class="space-y-2">
              <li class="flex justify-between">
                <span>Commit Activity:</span>
                <span class="font-medium">{{analysis.predictedTrends.commitTrend}}</span>
              </li>
              <li class="flex justify-between">
                <span>Issue Resolution:</span>
                <span class="font-medium">{{analysis.predictedTrends.issueResolutionRate}}</span>
              </li>
              <li class="flex justify-between">
                <span>Community Growth:</span>
                <span class="font-medium">{{analysis.predictedTrends.contributorGrowth}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-lg mb-2">AI Recommendations</h3>
          <ul class="space-y-2">
            <li *ngFor="let rec of analysis.recommendations" class="flex items-start">
              <svg class="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span>{{rec}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold text-lg mb-2">Code Complexity Analysis</h3>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="relative h-4 bg-gray-200 rounded-full">
            <div class="absolute top-0 left-0 h-full rounded-full"
              [style.width.%]="analysis.codeComplexityScore"
              [ngClass]="{
                'bg-green-500': analysis.codeComplexityScore <= 33,
                'bg-yellow-500': analysis.codeComplexityScore <= 66 && analysis.codeComplexityScore > 33,
                'bg-red-500': analysis.codeComplexityScore > 66
              }">
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-600 text-center">
            Complexity Score: {{analysis.codeComplexityScore.toFixed(1)}}
          </div>
        </div>
      </div>
    </div>
  `
})
export class AIInsightsComponent {
  @Input() analysis: any;
}
