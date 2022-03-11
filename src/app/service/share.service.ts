import { Injectable } from '@angular/core';
import { isMobile } from '../util/isMobile';
import { GameControllerService } from './game-controller.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { take } from 'rxjs/operators';
import { convertSec } from '../util/convertSec';
import { HotToastService } from '@ngneat/hot-toast';
import { Player } from '../model/Player';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
    private toast: HotToastService,
    private http: HttpClient
  ) {}

  private _initData() {
    if (environment.production) {
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
    } else {
      this.startPlayer = {
        playerName: 'Alphonso Boyle Davies',
        playerId: 234396,
        history: [
          {
            teamName: 'Canada',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamId: '111455-2021/2022',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/21/30.png',
            teamId: '21-2021/2022',
            teamName: 'FC Bayern München',
          },
          {
            teamId: '111455-2020/2021',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamName: 'Canada',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/21/30.png',
            teamName: 'FC Bayern München',
            teamId: '21-2020/2021',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamId: '111455-2019/2020',
            teamName: 'Canada',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/21/30.png',
            teamId: '21-2019/2020',
            teamName: 'FC Bayern München',
          },
          {
            teamId: '21-2018/2019',
            teamName: 'FC Bayern München',
            teamImg: 'https://cdn.sofifa.net/teams/21/30.png',
          },
          {
            teamId: '111455-2018/2019',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamName: 'Canada',
          },
          {
            teamName: 'Vancouver Whitecaps FC',
            teamImg: 'https://cdn.sofifa.net/teams/101112/30.png',
            teamId: '101112-2018/2019',
          },
          {
            teamName: 'Canada',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamId: '111455-2017/2018',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/101112/30.png',
            teamId: '101112-2017/2018',
            teamName: 'Vancouver Whitecaps FC',
          },
        ],
        playerImg: 'https://cdn.sofifa.net/players/234/396/22_120.png',
      };

      this.endPlayer = {
        history: [
          {
            teamName: 'Canada',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamId: '111455-2021/2022',
          },
          {
            teamName: 'Vejle Boldklub',
            teamId: '822-2021/2022',
            teamImg: 'https://cdn.sofifa.net/teams/822/30.png',
          },
          {
            teamId: '111455-2020/2021',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamName: 'Canada',
          },
          {
            teamId: '1516-2020/2021',
            teamName: 'FC Midtjylland',
            teamImg: 'https://cdn.sofifa.net/teams/1516/30.png',
          },
          {
            teamId: '111455-2019/2020',
            teamName: 'Canada',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/1516/30.png',
            teamId: '1516-2019/2020',
            teamName: 'FC Midtjylland',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/1516/30.png',
            teamId: '1516-2018/2019',
            teamName: 'FC Midtjylland',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamName: 'Canada',
            teamId: '111455-2018/2019',
          },
          {
            teamName: 'Canada',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamId: '111455-2017/2018',
          },
          {
            teamId: '111455-2016/2017',
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamName: 'Canada',
          },
          {
            teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            teamName: 'Canada',
            teamId: '111455-2015/2016',
          },
        ],
        playerImg: 'https://cdn.sofifa.net/players/227/847/22_120.png',
        playerName: 'Manjrekar James',
        playerId: 227847,
      };
    }
  }

  private async _getImageBase64(player: Player): Promise<string | undefined> {
    return this.http
      .get<any>(
        `/api/generate-pic?url=${encodeURIComponent(
          player.playerImg.replace('_30', '_360')
        )}`
      )
      .toPromise()
      .then((res) => {
        return res['base64'];
      })
      .catch((err) => {
        console.warn(err);
        return undefined;
      });
  }

  private async _createCollage(): Promise<string> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const height = 240;
    const width = 480;
    canvas.height = height;
    canvas.width = width;

    const base64Img1 = await this._getImageBase64(this.startPlayer!);
    if (!base64Img1) {
      throw Error(`Could not get image for ${this.startPlayer?.playerName}`);
    }
    const image1 = await this._loadImage(base64Img1, true);

    const base64Img2 = await this._getImageBase64(this.endPlayer!);
    if (!base64Img2) {
      throw Error(`Could not get image for ${this.endPlayer?.playerName}`);
    }
    const image2 = await this._loadImage(base64Img2, true);

    const arrow = await this._loadImage('/assets/right-arrow.png', false);
    const stopwatch = await this._loadImage('/assets/stopwatch.png', false);

    //Draw gradient background
    const gradient = context!.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgb(16, 185, 129)');
    gradient.addColorStop(0.5, 'rgb(20,184, 166)');
    gradient.addColorStop(1, '#22c55e');
    context!.fillStyle = gradient;
    context!.fillRect(0, 0, width, height);
    //Draw player images on canvas
    context!.drawImage(image1, -width * 0.125, 0, width / 2, height);
    context!.drawImage(image2, width * 0.625, 0, width / 2, height);
    context!.drawImage(arrow, width / 4 + 32, height / 4 - 12, 64, 64);
    context!.drawImage(stopwatch, width / 4 + 32, height / 4 + 72, 64, 64);
    //Draw text on canvas
    context!.font = 'bold 48px Archivo';
    context!.fillStyle = 'white';
    context!.textAlign = 'center';
    context!.fillText(
      `${this.steps}`,
      width / 2 + 32,
      height / 2 - 24,
      width / 4
    );
    context!.fillText(
      `${convertSec(this.time)}`,
      width / 2 + 32,
      height / 2 + 64,
      width / 4
    );
    return canvas.toDataURL('image/png');
  }

  private async _loadImage(
    url: string,
    isBase64: boolean = false
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = isBase64 ? 'data:image/png;base64,' + url : url;
    });
  }

  async share(): Promise<void> {
    this._initData();

    const canvasDataUrl = await this._createCollage();
    const blob = await (await fetch(canvasDataUrl)).blob();

    const shareText = `${this.startPlayer?.playerName} ➡️${this.steps} ${
      this.endPlayer?.playerName
    }\n\n🕐${convertSec(this.time)}\n\nhttps://footy.notmydayjob.fyi/game/${
      this.startPlayer?.playerId
    }_${this.endPlayer?.playerId}`;

    //if (isMobile()) {
    await navigator.share({
      text: shareText,
      files: [new File([blob], 'footy.png', { type: 'image/png' })],
    });
    // } else {
    //   this.clipboard.copy(shareText);

    //   this.toast.success('Copied!');
    // }
  }
}
