import { Injectable } from '@angular/core';
import { isMobile } from '../util/isMobile';
import { GameControllerService } from './game-controller.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { take } from 'rxjs/operators';
import { convertSec } from '../util/convertSec';
import { HotToastService } from '@ngneat/hot-toast';
import { Player } from '../model/Player';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  startPlayer: Player | undefined;
  endPlayer: Player | undefined;
  steps: number = 0;
  time: number = 0;

  constructor(
    private gameControllerService: GameControllerService,
    private clipboard: Clipboard,
    private toast: HotToastService
  ) {
    this.gameControllerService.startPlayer$
      .pipe(take(1))
      .subscribe((player) => (this.startPlayer = player!));

    this.gameControllerService.endPlayer$
      .pipe(take(1))
      .subscribe((player) => (this.endPlayer = player!));

    this.gameControllerService.steps$
      .pipe(take(1))
      .subscribe((steps) => (this.steps = steps));

    this.gameControllerService.time$
      .pipe(take(1))
      .subscribe((time) => (this.time = time));
  }

  async share(): Promise<void> {
    const shareText = `${this.startPlayer?.playerName} ➡️${this.steps} ${
      this.endPlayer?.playerName
    }\n\n🕐${convertSec(this.time)}\n\nhttps://footy.notmydayjob.fyi/game/${
      this.startPlayer?.playerId
    }_${this.endPlayer?.playerId}`;

    if (isMobile()) {
      await navigator.share({
        text: shareText,
      });
    } else {
      this.clipboard.copy(shareText);

      this.toast.success('Copied!');
    }
  }
}
