import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../model/Player';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _customStartPlayer$: BehaviorSubject<Player | undefined> =
    new BehaviorSubject<Player | undefined>(undefined);
  customStartPlayer$: Observable<Player | undefined> =
    this._customStartPlayer$.asObservable();

  private readonly _difficulty$: BehaviorSubject<number> =
    new BehaviorSubject<number>(1);
  difficulty$: Observable<number> = this._difficulty$.asObservable();

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {
    const savedPlayer = this.localStorage.getItem('customStartPlayer');
    if (savedPlayer) {
      this._customStartPlayer$.next(JSON.parse(savedPlayer) as Player);
    }

    const savedDifficulty = this.localStorage.getItem('difficulty');
    if (savedDifficulty) {
      this._difficulty$.next(parseInt(savedDifficulty));
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

  setCustomStartPlayer(newPlayer: Player) {
    this._customStartPlayer$.next(newPlayer);
    this.localStorage.setItem('customStartPlayer', JSON.stringify(newPlayer));
  }
}
