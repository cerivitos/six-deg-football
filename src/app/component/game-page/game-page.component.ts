import { Component, OnInit } from '@angular/core';

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { getApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { Player } from 'src/app/model/Player';
import { GameControllerService } from 'src/app/service/game-controller.service';
import { Observable } from 'rxjs';
import { convertMs } from 'src/app/util/convertMs';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css'],
})
export class GamePageComponent implements OnInit {
  constructor(private gameControllerService: GameControllerService) {}

  startPlayer$: Observable<Player | undefined> = new Observable<
    Player | undefined
  >();

  endPlayer$: Observable<Player | undefined> = new Observable<
    Player | undefined
  >();

  steps$: Observable<number> = new Observable<number>();
  time$: Observable<number> = new Observable<number>();

  ngOnInit() {
    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(environment.appCheck.key),
      isTokenAutoRefreshEnabled: true,
    });

    this.initGame(1111, 100375);
  }

  async initGame(startPlayerId: number, endPlayerId: number) {
    await this.gameControllerService.initGame(startPlayerId, endPlayerId);
    this.startPlayer$ = this.gameControllerService.startPlayer$;
    this.endPlayer$ = this.gameControllerService.endPlayer$;
    this.steps$ = this.gameControllerService.steps$;
    this.time$ = this.gameControllerService.time$;
  }

  convertMs(ms: number | null): string {
    return convertMs(ms);
  }
}
