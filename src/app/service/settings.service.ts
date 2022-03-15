import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../model/Team';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _savedStartTeam$: BehaviorSubject<Team | undefined> =
    new BehaviorSubject<Team | undefined>(undefined);
  savedStartTeam$: Observable<Team | undefined> =
    this._savedStartTeam$.asObservable();

  private readonly _difficulty$: BehaviorSubject<number> =
    new BehaviorSubject<number>(1);
  difficulty$: Observable<number> = this._difficulty$.asObservable();

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {
    const savedDifficulty = this.localStorage.getItem('difficulty');
    if (savedDifficulty) {
      this._difficulty$.next(parseInt(savedDifficulty));
    }

    const savedStartTeam = this.localStorage.getItem('startTeam');
    if (savedStartTeam) {
      this._savedStartTeam$.next(JSON.parse(savedStartTeam) as Team);
    }
  }

  setDifficulty() {
    const newDifficulty =
      this._difficulty$.getValue() + 1 > 3
        ? 1
        : this._difficulty$.getValue() + 1;
    this._difficulty$.next(newDifficulty);
    this.localStorage.setItem('difficulty', newDifficulty.toString());
  }

  getDifficulty(): number {
    return this._difficulty$.getValue();
  }

  setStartTeam(team: Team | undefined) {
    this._savedStartTeam$.next(team);

    if (team) {
      this.localStorage.setItem('startTeam', JSON.stringify(team));
    } else {
      this.localStorage.removeItem('startTeam');
    }
  }

  getStartTeam(): Team | undefined {
    return this._savedStartTeam$.getValue();
  }
}
