import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';
import { Team } from 'src/app/model/Team';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css'],
})
export class StartPageComponent implements OnInit {
  version: string = '';
  savedStartTeam$: Observable<Team | undefined> = new Observable<
    Team | undefined
  >();
  difficulty$: Observable<number> = new Observable<number>();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.savedStartTeam$ = this.settingsService.savedStartTeam$;
    this.difficulty$ = this.settingsService.difficulty$;

    this.http
      .get('/api/query-sha', { responseType: 'text' })
      .pipe(take(1))
      .subscribe((sha) => (this.version = sha));
  }

  setDifficulty() {
    this.settingsService.setDifficulty();
  }
}
