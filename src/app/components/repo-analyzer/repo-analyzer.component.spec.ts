import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoAnalyzerComponent } from './repo-analyzer.component';

describe('RepoAnalyzerComponent', () => {
  let component: RepoAnalyzerComponent;
  let fixture: ComponentFixture<RepoAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoAnalyzerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
