import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';
import { Player } from 'src/app/model/Player';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css'],
})
export class StartPageComponent implements OnInit {
  version: string = '';
  customStartPlayer$: Observable<Player | undefined> = new Observable<
    Player | undefined
  >();
  difficulty$: Observable<number> = new Observable<number>();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.customStartPlayer$ = this.settingsService.customStartPlayer$;
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
