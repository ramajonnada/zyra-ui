import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of, shareReplay } from 'rxjs';

interface GithubRepo {
    stargazers_count: number;
}

@Injectable({ providedIn: 'root' })
export class GithubService {
    private readonly http = inject(HttpClient);

    readonly stars$ = this.http
        .get<GithubRepo>('https://api.github.com/repos/ramajonnada/zyra-ui')
        .pipe(
            map((repo) => repo.stargazers_count),
            catchError(() => of(null)),
            shareReplay(1),
        );
}
