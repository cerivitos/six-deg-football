import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css'],
})
export class StartPageComponent implements OnInit {
  version: string = '';
  customStartPlayerName: string | undefined;
  difficulty: number = 1;

  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage
  ) {}

  ngOnInit(): void {
    const customStartPlayer = this.localStorage.getItem('customStartPlayer');
    if (customStartPlayer) {
      this.customStartPlayerName = JSON.parse(customStartPlayer)['playerName'];
    } else {
      this.customStartPlayerName = 'Random';
    }

    const savedDifficulty = this.localStorage.getItem('difficulty');
    if (savedDifficulty) {
      this.difficulty = parseInt(savedDifficulty);
    }

    this.http
      .get<string>('/api/query-sha')
      .pipe(take(1))
      .subscribe((sha) => (this.version = sha));
  }
}
