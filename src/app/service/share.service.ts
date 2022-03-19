import { Injectable } from '@angular/core';
import { isMobile } from '../util/isMobile';
import { GameControllerService } from './game-controller.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { take } from 'rxjs/operators';
import { convertSec } from '../util/convertSec';
import { HotToastService } from '@ngneat/hot-toast';
import { Player } from '../model/Player';
import { HttpClient } from '@angular/common/http';
import { Team } from '../model/Team';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  startPlayer: Player | undefined;
  endPlayer: Player | undefined;
  teamPath: Team[] = [];
  steps: number = 0;
  time: number = 0;

  constructor(
    private gameControllerService: GameControllerService,
    private clipboard: Clipboard,
    private toast: HotToastService,
    private http: HttpClient
  ) {}

  private _initData() {
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

    this.gameControllerService.teamPath$
      .pipe(take(1))
      .subscribe((path) => (this.teamPath = path));
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
    const height = 480;
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

    const background = await this._loadImage(
      '/assets/share-background.png',
      false
    );
    const arrow = await this._loadImage('/assets/right-arrow.png', false);
    const stopwatch = await this._loadImage('/assets/stopwatch.png', false);

    //Add background
    context!.drawImage(background, 0, 0, width, height);
    //Draw player images on canvas
    context!.drawImage(image1, -width * 0.125, 0, width / 2, height);
    context!.drawImage(image2, width * 0.625, 0, width / 2, height);
    context!.drawImage(arrow, width / 4 + 32, height / 4 - 12, 64, 64);
    context!.drawImage(stopwatch, width / 4 + 32, height / 4 + 72, 64, 64);
    //Draw text on canvas
    context!.font = 'bold 48px Archivo';
    context!.fillStyle = '#0c1027';
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

  private _generateTeamIds(): string {
    const teamIds = this.teamPath.map((team) => {
      //Remove season from teamId
      return team.teamId.split('-')[0];
    });

    const uniqueTeamIds = [...new Set(teamIds)];

    let teamIdsPositions: string[] = [];
    teamIds.forEach((teamId) => {
      teamIdsPositions.push(uniqueTeamIds.indexOf(teamId).toString());
    });

    return `~${uniqueTeamIds.join('-')}~${teamIdsPositions.join('-')}`;
  }

  async share(): Promise<boolean> {
    this._initData();

    const shareText = `${this.startPlayer?.playerName} ➡️${this.steps}➡️ ${
      this.endPlayer?.playerName
    }\n🕐${convertSec(this.time)}\n\n🔗https://44f2.notmydayjob.fyi/${
      this.startPlayer?.playerId
    }-${this.endPlayer?.playerId}${this._generateTeamIds()}`;

    if (isMobile()) {
      const canvasDataUrl = await this._createCollage();
      const blob = await (await fetch(canvasDataUrl)).blob();

      try {
        await navigator.share({
          text: shareText,
          files: [new File([blob], '44f2.png', { type: 'image/png' })],
        });

        return true;
      } catch (err) {
        this.toast.error('Oops! Something went wrong.');
        return false;
      }
    } else {
      this.clipboard.copy(shareText);
      this.toast.success('Copied!');
      return true;
    }
  }
}
