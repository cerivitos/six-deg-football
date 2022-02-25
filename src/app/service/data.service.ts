import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Player } from '../model/Player';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: AngularFirestore) {}

  async getPlayer(playerId: number): Promise<Player | undefined> {
    return this.firestore
      .doc(`players/${playerId}`)
      .ref.get()
      .then((doc) => {
        return doc.data() as Player;
      })
      .catch((error) => {
        console.warn(error);
        return undefined;
      });
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
}
