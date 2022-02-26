import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../model/Player';
import { Team } from '../model/Team';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class GameControllerService {
  private _steps$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly steps$ = this._steps$.asObservable();

  private _time$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly time$ = this._time$.asObservable();

  timer: any;

  private _selectionState$: BehaviorSubject<'team' | 'player'> =
    new BehaviorSubject<'team' | 'player'>('team');
  public readonly selectionState$ = this._selectionState$.asObservable();

  private _startPlayer$: BehaviorSubject<Player | undefined> =
    new BehaviorSubject<Player | undefined>(undefined);
  public readonly startPlayer$ = this._startPlayer$.asObservable();

  private _endPlayer$: BehaviorSubject<Player | undefined> =
    new BehaviorSubject<Player | undefined>(undefined);
  public readonly endPlayer$ = this._endPlayer$.asObservable();

  private _playerHistory$: BehaviorSubject<Player[]> = new BehaviorSubject<
    Player[]
  >([]);
  public readonly playerHistory$ = this._playerHistory$.asObservable();

  private _teamHistory$: BehaviorSubject<Team[]> = new BehaviorSubject<Team[]>(
    []
  );
  public readonly teamHistory$ = this._teamHistory$.asObservable();

  constructor(private dataService: DataService) {}

  async initGame(startPlayerId: number, endPlayerId: number) {
    this._startPlayer$.next(await this.dataService.getPlayer(startPlayerId));
    this._endPlayer$.next(await this.dataService.getPlayer(endPlayerId));

    if (this._startPlayer$.getValue() && this._endPlayer$.getValue()) {
      this._steps$.next(0);
      this._time$.next(0);
      this._playerHistory$.next([this._startPlayer$.getValue()!]);
      this._teamHistory$.next([]);
      this._selectionState$.next('team');

      setInterval(() => {
        this._time$.next(this._time$.getValue() + 1000);
      }, 1000);
    } else {
      throw new Error(
        `Player not found: ${this._startPlayer$.getValue()} or ${this._endPlayer$.getValue()}`
      );
    }
  }

  async onTeamSelected(team: Team) {
    const players = await this.dataService.getPlayersInTeam(
      parseInt(team.teamId)
    );

    if (players.length > 0) {
      this._teamHistory$.next(this._teamHistory$.getValue().concat(team));
    } else {
      throw new Error(
        `No players found in team ${team.teamId} ${team.teamName}`
      );
    }
  }

  async onPlayerSelected(player: Player) {
    this._playerHistory$.next(this._playerHistory$.getValue().concat(player));
  }
}
