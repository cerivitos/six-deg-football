import { Injectable } from '@angular/core';
import { isMobile } from '../util/isMobile';
import { GameControllerService } from './game-controller.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { tap } from 'rxjs/operators';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(
    private gameControllerService: GameControllerService,
    private clipboard: Clipboard
  ) {}

  private async _createCanvasImg(): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 640;
    const height = 640;
    canvas.width = width;
    canvas.height = height;
    ctx!.fillStyle = '#fff';
    ctx!.fillRect(0, 0, width, height);

    let startPlayer: HTMLImageElement = new Image();
    let endPlayer: HTMLImageElement = new Image();
    // startPlayer.crossOrigin = 'Anonymous';
    // endPlayer.crossOrigin = 'Anonymous';

    const capture = await html2canvas(document.querySelector('#capture')!, {
      allowTaint: false,
    });
    const img = capture.toDataURL('image/png');
    startPlayer.src = img;
    await startPlayer.decode();
    ctx?.drawImage(startPlayer, 0, 0, 240, 240);

    // this.gameControllerService.startPlayer$
    //   .pipe(
    //     tap(
    //       (player) =>
    //         (startPlayer.src = player!.playerImg.replace('30.png', '90.png'))
    //     )
    //   )
    //   .subscribe();
    // this.gameControllerService.endPlayer$
    //   .pipe(
    //     tap(
    //       (player) =>
    //         (endPlayer.src = player!.playerImg.replace('30.png', '90.png'))
    //     )
    //   )
    //   .subscribe();

    // await startPlayer.decode();
    // ctx?.drawImage(startPlayer, 0, height, 240, 240);

    // await endPlayer.decode();
    // ctx?.drawImage(endPlayer, width - 240, height, 240, 240);

    return canvas;
  }

  private _convertToPng(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
  }

  async shareImg(): Promise<void> {
    const canvas = await this._createCanvasImg();
    const img = this._convertToPng(canvas);

    //if (isMobile()) {
    const response = await fetch(img);
    const blob = await response.blob();
    const file = new File([blob], 'share.png', { type: 'image/png' });
    const shareData = {
      files: [file],
    };

    // if (navigator.canShare()) {
    navigator.share(shareData);
    //}
    //} else {
    //  this.clipboard.copy('Text copied');
    // }
  }
}
