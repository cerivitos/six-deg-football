import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Player } from '../model/Player';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: AngularFirestore) {}

  async getPlayer(playerId: number): Promise<Player | undefined> {
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

  async getPlayersInTeam(teamId: number): Promise<Player[]> {
    const snapshot = await this.firestore
      .collection('players')
      .ref.where('teamId', '==', teamId)
      .get();

    if (snapshot.empty) {
      return [];
    } else {
      let players: Player[] = [];
      snapshot.forEach((doc) => {
        players.push(doc.data() as Player);
      });

      return players;
    }
  }
}
