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
}
