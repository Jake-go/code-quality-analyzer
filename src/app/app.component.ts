import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RepoAnalyzerComponent } from './components/repo-analyzer/repo-analyzer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RepoAnalyzerComponent],
  template: `
    <app-repo-analyzer></app-repo-analyzer>
  `
})
export class AppComponent {
  title = 'code-quality-analyzer';
}
