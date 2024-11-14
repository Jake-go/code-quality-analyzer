import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { mergeMap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private baseUrl = 'https://api.github.com';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': `token ${environment.gitHubToken}`,
      'Accept': 'application/vnd.github.v3+json'
    })
   }

  getRepositoryData(owner: string, repo: string): Observable<any> {
    const options = { headers: this.headers };

    const repoInfo = this.http.get(`${this.baseUrl}/repos/${owner}/${repo}`, options);
    const languages = this.http.get(`${this.baseUrl}/repos/${owner}/${repo}/languages`, options);
    const contributors = this.http.get(`${this.baseUrl}/repos/${owner}/${repo}/contributors?per_page=1`,
      {...options, observe: 'response'}
    );
    const pullRequests = this.http.get(`${this.baseUrl}/repos/${owner}/${repo}/pulls?state=all&per_page=1`,
      {...options, observe: 'response'}
    );

    const commits = this.http.get<any[]>(`${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=100`, options).pipe(
      mergeMap(commitList => {
        const detailedCommits = commitList.map(commit => 
          this.http.get(`${this.baseUrl}/repos/${owner}/${repo}/commits/${commit.sha}`, options)
        );
        return forkJoin(detailedCommits).pipe(
          map(commits => commits.filter(commit => commit != null))
        );
      })
    );
  
    return forkJoin({
      repoInfo,
      commits,
      languages,
      contributors,
      pullRequests
    });
  }
}
