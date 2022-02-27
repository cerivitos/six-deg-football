import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../model/Player';
import { Team } from '../model/Team';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class GameControllerService {
  private _steps$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  /**
   * Number of players selected so far - Used as the score
   * @memberof GameControllerService
   */
  public readonly steps$ = this._steps$.asObservable();

  private _time$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  /**
   * The time elapsed so far in ms
   * @memberof GameControllerService
   */
  public readonly time$ = this._time$.asObservable();

  timer: any;

  private _selectionState$: BehaviorSubject<'team' | 'player'> =
    new BehaviorSubject<'team' | 'player'>('team');
  /**
   * Selection state flag used to conditionally toggle between team and player selection lists in GamePageComponent
   * @memberof GameControllerService
   */
  public readonly selectionState$ = this._selectionState$.asObservable();

  private _startPlayer$: BehaviorSubject<Player | undefined> =
    new BehaviorSubject<Player | undefined>(undefined);
  /**
   * The player to start the game with
   * @memberof GameControllerService
   */
  public readonly startPlayer$ = this._startPlayer$.asObservable();

  private _endPlayer$: BehaviorSubject<Player | undefined> =
    new BehaviorSubject<Player | undefined>(undefined);
  /**
   * The target player to be reached
   * @memberof GameControllerService
   */
  public readonly endPlayer$ = this._endPlayer$.asObservable();

  private _currentPlayerList$: BehaviorSubject<Player[]> = new BehaviorSubject<
    Player[]
  >([]);
  /**
   * List of players from a specific team to show when selectionState is 'player'
   * @memberof GameControllerService
   */
  public readonly currentPlayerList$ = this._currentPlayerList$.asObservable();

  private _playerHistory$: BehaviorSubject<Player[]> = new BehaviorSubject<
    Player[]
  >([]);
  /**
   * Array of players selected so far, including the start player
   * @memberof GameControllerService
   */
  public readonly playerHistory$ = this._playerHistory$.asObservable();

  private _teamHistory$: BehaviorSubject<Team[]> = new BehaviorSubject<Team[]>(
    []
  );
  /**
   * Array of teams selected so far
   * @memberof GameControllerService
   */
  public readonly teamHistory$ = this._teamHistory$.asObservable();

  constructor(private dataService: DataService, private router: Router) {}

  async initGame(startPlayerId: number, endPlayerId: number) {
    this._startPlayer$.next(await this.dataService.getPlayer(startPlayerId));
    this._endPlayer$.next(await this.dataService.getPlayer(endPlayerId));

    if (this._startPlayer$.getValue() && this._endPlayer$.getValue()) {
      this._steps$.next(0);
      this._time$.next(0);
      this._playerHistory$.next([this._startPlayer$.getValue()!]);
      this._teamHistory$.next([]);
      this._selectionState$.next('team');

      this.timer = this._startTimer();
    } else {
      throw new Error(
        `Player not found: ${this._startPlayer$.getValue()} or ${this._endPlayer$.getValue()}`
      );
    }
  }

  private _startTimer(): any {
    return setInterval(() => {
      this._time$.next(this._time$.getValue() + 1000);
    }, 1000);
  }

  private _checkIfWin(selectedPlayer: Player, endPlayer: Player): boolean {
    if (selectedPlayer.playerId === endPlayer.playerId) {
      return true;
    } else {
      return false;
    }
  }

  async onTeamSelected(team: Team) {
    const players = await this.dataService.getPlayersInTeam(team);

    if (players.length > 0) {
      this._teamHistory$.next(this._teamHistory$.getValue().concat(team));
      this._currentPlayerList$.next(players);
      this._selectionState$.next('player');
    } else {
      throw new Error(
        `No players found in team ${team.teamId} ${team.teamName}`
      );
    }
  }

  async onPlayerSelected(player: Player) {
    this._playerHistory$.next(this._playerHistory$.getValue().concat(player));

    if (this._checkIfWin(player, this._endPlayer$.getValue()!)) {
      clearInterval(this.timer);
      this._steps$.next(this._steps$.getValue() + 1);
      this.router.navigateByUrl('/result');
    } else {
      this._selectionState$.next('team');
      this._steps$.next(this._steps$.getValue() + 1);
    }
  }
}
