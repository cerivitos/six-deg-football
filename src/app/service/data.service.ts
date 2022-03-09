import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Player } from '../model/Player';
import { Team } from '../model/Team';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  getTrendingPlayerId(): Observable<number> {
    return this.http.get<number>('/api/fetch-trending');
  }

  async generateStartAndEndPlayers(
    startPlayerId: number
  ): Promise<Player[] | undefined> {
    const startPlayer = await this._getPlayer(startPlayerId);

    if (startPlayer) {
      let history = startPlayer.history;
      const walks = Math.floor(Math.random() * 8);
      let endPlayer;

      for (let i = 0; i < walks; i++) {
        const randomTeam = history[Math.floor(Math.random() * history.length)];
        const players = await this.getPlayersInTeam(randomTeam);
        const randomPlayer =
          players[Math.floor(Math.random() * players.length)];
        history = randomPlayer.history;

        if (i === walks - 1) {
          endPlayer = randomPlayer;

          return [startPlayer, endPlayer];
        }
      }
    } else {
      return undefined;
    }

    return undefined;
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
