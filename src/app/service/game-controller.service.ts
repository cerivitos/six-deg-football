import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../model/Player';
import { Team } from '../model/Team';
import { DataService } from './data.service';
import { WINDOW } from '@ng-web-apis/common';
import { SettingsService } from './settings.service';

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

  private _selectionState$: BehaviorSubject<
    'team' | 'player' | 'loading' | 'error'
  > = new BehaviorSubject<'team' | 'player' | 'loading' | 'error'>('team');
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

  private _teamPath$: BehaviorSubject<Team[]> = new BehaviorSubject<Team[]>([]);
  public readonly teamPath$ = this._teamPath$.asObservable();

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

  constructor(
    private dataService: DataService,
    private router: Router,
    @Inject(WINDOW) readonly windowRef: any,
    private settingsService: SettingsService
  ) {}

  async initGame(startPlayerId?: number, endPlayerId?: number) {
    let players: Player[] | undefined;

    const savedStartTeam = this.settingsService.getStartTeam();

    if (startPlayerId && endPlayerId) {
      players = await this.dataService.generateChallengeGame(
        startPlayerId,
        endPlayerId
      );

      if (players) {
        this._startPlayer$.next(players[0]);
        this._endPlayer$.next(players[1]);

        this._initGameInfo();
      } else {
        this._selectionState$.next('error');

        throw new Error(
          `Error during challenge game initialization: Start player Id: ${startPlayerId} End player Id: ${endPlayerId}`
        );
      }
    } else if (savedStartTeam) {
      const player = await this.dataService.getPlayerFromSavedTeam(
        savedStartTeam
      );

      if (player) {
        const generatedData = await this.dataService.generateGameData(
          player.playerId
        );

        if (generatedData) {
          this._startPlayer$.next(generatedData.players[0] as Player);
          this._endPlayer$.next(generatedData.players[1] as Player);
          this._teamPath$.next(generatedData.teams as Team[]);

          this._initGameInfo();
        }
      } else {
        this._selectionState$.next('error');

        throw new Error(
          `Error during saved team game initialization: Saved start team: ${savedStartTeam}`
        );
      }
    } else {
      this.dataService.getTrendingPlayerId().subscribe(async (id) => {
        const generatedData = await this.dataService.generateGameData(id!);

        if (generatedData) {
          this._startPlayer$.next(generatedData.players[0] as Player);
          this._endPlayer$.next(generatedData.players[1] as Player);
          this._teamPath$.next(generatedData.teams as Team[]);

          this._initGameInfo();
        } else {
          this._selectionState$.next('error');

          throw new Error(
            `Error during game initialization: Trending player Id: ${id}`
          );
        }
      });
    }
  }

  private _initGameInfo() {
    this._steps$.next(0);
    this._time$.next(0);
    this._playerHistory$.next([this._startPlayer$.getValue()!]);
    this._teamHistory$.next([]);
    this._selectionState$.next('team');

    this.timer = this._startTimer();
  }

  resetGame() {
    this._startPlayer$.next(undefined);
    this._endPlayer$.next(undefined);
    this._teamPath$.next([]);

    this._steps$.next(0);
    clearInterval(this.timer);
    this._time$.next(0);
    this._playerHistory$.next([]);
    this._teamHistory$.next([]);
    this._selectionState$.next('team');
  }

  private _startTimer(): any {
    return setInterval(() => {
      this._time$.next(this._time$.getValue() + 1);
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
    this._selectionState$.next('loading');
    this.windowRef.self.scrollTo({ top: 0 });
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
      this.windowRef.self.scrollTo({ top: 0 });
      this._selectionState$.next('team');
      this._steps$.next(this._steps$.getValue() + 1);
    }
  }
}
