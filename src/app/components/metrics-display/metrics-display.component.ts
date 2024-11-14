import { Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepoMetrics } from '../../models/metrics';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';

@Component({
  selector: 'app-metrics-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics-display.component.html',
  styleUrl: './metrics-display.component.css'
})
export class MetricsDisplayComponent implements OnChanges{
  @Input() metrics!: RepoMetrics;
  @ViewChild('languagesChart') languagesChartRef!: ElementRef;
  @ViewChild('activityChart') activityChartRef!: ElementRef;
  
  private languagesChart?: Chart | undefined;
  private activityChart?: Chart | undefined;

  ngOnChanges(){
    if(this.metrics){
      setTimeout(() => {
        this.initializeCharts();
      }, 0);
    }
  }

  private createLanguagesChart(){
    if(this.languagesChart){
      this.languagesChart.destroy();
    }

    const ctx = this.languagesChartRef.nativeElement.getContext('2d');
    const languages = this.metrics.languages;

    const data: ChartData = {
      labels: Object.keys(languages),
      datasets: [{
        label: 'Languages',
        data: Object.values(languages),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF, #FF9F40', '#4BC0C0', '#9966FF'
        ]
      }]
    };

    const config: ChartConfiguration = {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Languages Distribution (%)'
          },
          legend: {
            position: 'right',
            labels: {
              boxWidth: 20
            }
          }
        }
      }
    };

    this.languagesChart = new Chart(ctx, config);
  }

  private createActivityChart(){
    if (this.activityChart) {
      this.activityChart.destroy();
    }

    const ctx = this.activityChartRef.nativeElement.getContext('2d');
    const values = [
      this.metrics.totalCommits,
      this.metrics.issuesCount,
      this.metrics.pullRequestsCount
    ];
    const maxValue = Math.max(...values);

    const data: ChartData = {
      labels: ['Commits', 'Issues', 'Pull Requests'],
      datasets: [{
        label: 'Repository Activity',
        data: values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };


    const config: ChartConfiguration = {
      type: 'bar',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              stepSize: Math.ceil(maxValue / 10),
              count: 10
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Repository Activity'
            },
            legend: {
              display: false
          }
        }
      }
      }
      this.activityChart = new Chart(ctx, config);
    };

  private initializeCharts() {
    this.createLanguagesChart();
    this.createActivityChart();
  }
}

