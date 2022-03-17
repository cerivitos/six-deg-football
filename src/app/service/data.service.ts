import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { WINDOW } from '@ng-web-apis/common';
import { Observable } from 'rxjs';
import { Player } from '../model/Player';
import { Team } from '../model/Team';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { getApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
    @Inject(WINDOW) readonly windowRef: any,
    private settingsService: SettingsService
  ) {
    if (location.hostname === 'localhost') {
      this.windowRef.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(environment.appCheck.key),
      isTokenAutoRefreshEnabled: true,
    });
  }

  seasons = [
    '2006/2007',
    '2007/2008',
    '2008/2009',
    '2009/2010',
    '2010/2011',
    '2011/2012',
    '2012/2013',
    '2013/2014',
    '2014/2015',
    '2015/2016',
    '2016/2017',
    '2017/2018',
    '2018/2019',
    '2019/2020',
    '2020/2021',
    '2021/2022',
  ];

  /**
   * Generates a random start player from the SoFIFA Trending page when no saved start team is found
   * @returns playerId
   */
  getTrendingPlayerId(): Observable<number> {
    return this.http.get<number>('/api/fetch-trending');
  }

  /**
   * Get a random start player from a random season of the saved start team. The function tries another season if no players are found for that season.
   * @param team - The saved start team
   * @returns The start player from the saved start team
   */
  async getPlayerFromSavedTeam(
    team: Team,
    seasonIndex?: number
  ): Promise<Player | undefined> {
    let _seasonIndex = seasonIndex;

    if (!_seasonIndex) {
      _seasonIndex = Math.max(this.seasons.length - 1, 0);
    }

    const teamWithSeason = Object.assign({}, team);
    teamWithSeason.teamId = team.teamId + '-' + this.seasons[_seasonIndex];

    const snapshot = await this.firestore
      .collection('players')
      .ref.where('history', 'array-contains', teamWithSeason)
      .get();

    if (snapshot.empty) {
      return this.getPlayerFromSavedTeam(team, _seasonIndex - 1);
    } else {
      let players: Player[] = [];
      snapshot.forEach((doc) => {
        players.push(doc.data() as Player);
      });

      return players[Math.floor(Math.random() * players.length)];
    }
  }

  async generateGameData(
    startPlayerId: number
  ): Promise<Record<string, Player[] | Team[]> | undefined> {
    const startPlayer = await this._getPlayer(startPlayerId);
    const difficulty = this.settingsService.getDifficulty();
    let generatedPlayers = [];
    let generatedTeams = [];

    if (startPlayer) {
      let history = startPlayer.history;
      //Ensure minimum of one step
      const walks = Math.floor((Math.random() + 1) * (difficulty + 1));
      let endPlayer;

      for (let i = 0; i < walks; i++) {
        //Bias random selection towards more recent teams according to difficulty
        const randomTeam =
          history[
            Math.floor(
              Math.random() *
                Math.max(Math.floor(history.length * difficulty * 0.25), 1)
            )
          ];
        generatedTeams.push(randomTeam);
        const players = await this.getPlayersInTeam(randomTeam);
        const randomPlayer =
          players[Math.floor(Math.random() * players.length)];
        history = randomPlayer.history;

        if (i === walks - 1) {
          endPlayer = randomPlayer;
          generatedPlayers = [startPlayer, endPlayer];
          return { players: generatedPlayers, teams: generatedTeams };
        }
      }
    } else {
      return undefined;
    }

    return undefined;
  }

  async generateChallengeGame(
    startPlayerId: number,
    endPlayerId: number
  ): Promise<Player[] | undefined> {
    const startPlayer = await this._getPlayer(startPlayerId);
    const endPlayer = await this._getPlayer(endPlayerId);

    if (startPlayer && endPlayer) {
      return [startPlayer, endPlayer];
    } else {
      return undefined;
    }
  }

  private async _getPlayer(playerId: number): Promise<Player | undefined> {
    const snapshot = await this.firestore.doc(`players/${playerId}`).ref.get();

    if (snapshot.exists) {
      return snapshot.data() as Player;
    } else {
      return undefined;
    }
  }

  async getMockStartPlayer(playerId: number): Promise<Player | undefined> {
    return {
      playerName: 'Alan Damián Medina Silva',
      playerId: 253259,
      playerImg: 'https://cdn.sofifa.net/players/253/259/21_120.png',
      history: [
        {
          teamId: '111326-2020/2021',
          teamName: 'Liverpool Fútbol Club',
          teamImg: 'https://cdn.sofifa.net/teams/111326/30.png',
        },
        {
          teamId: '111326-2019/2020',
          teamName: 'Liverpool Fútbol Club',
          teamImg: 'https://cdn.sofifa.net/teams/111326/30.png',
        },
      ],
    };
  }

  async getMockEndPlayer(playerId: number): Promise<Player | undefined> {
    return {
      playerName: 'Calvin Owen Harm Raatsie',
      playerId: 261294,
      playerImg: 'https://cdn.sofifa.net/players/261/294/22_120.png',
      history: [
        {
          teamId: '245-2021/2022',
          teamName: 'Ajax',
          teamImg: 'https://cdn.sofifa.net/teams/245/30.png',
        },
        {
          teamId: '245-2020/2021',
          teamName: 'Ajax',
          teamImg: 'https://cdn.sofifa.net/teams/245/30.png',
        },
      ],
    };
  }

  async getPlayersInTeam(team: Team): Promise<Player[]> {
    const snapshot = await this.firestore
      .collection('players')
      .ref.where('history', 'array-contains', team)
      .get();

    if (snapshot.empty) {
      return [];
    } else {
      let players: Player[] = [];
      snapshot.forEach((doc) => {
        players.push(doc.data() as Player);
      });

      return players.sort((a, b) => a.playerName.localeCompare(b.playerName));
    }
  }
}
