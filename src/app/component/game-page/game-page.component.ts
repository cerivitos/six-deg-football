import { Component, OnInit } from '@angular/core';

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { getApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { Player } from 'src/app/model/Player';
import { GameControllerService } from 'src/app/service/game-controller.service';
import { Observable } from 'rxjs';
import { convertMs } from 'src/app/util/convertMs';
import { Team } from 'src/app/model/Team';

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
  selectionState$: Observable<'team' | 'player'> = new Observable<
    'team' | 'player'
  >();

  teamHistory$: Observable<Team[]> = new Observable<Team[]>();
  playerHistory$: Observable<Player[]> = new Observable<Player[]>();

  currentPlayerList$: Observable<Player[]> = new Observable<Player[]>();

  ngOnInit() {
    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(environment.appCheck.key),
      isTokenAutoRefreshEnabled: true,
    });

    this.initGame(1111, 103503);
  }

  async initGame(startPlayerId: number, endPlayerId: number) {
    await this.gameControllerService.initGame(startPlayerId, endPlayerId);
    this.startPlayer$ = this.gameControllerService.startPlayer$;
    this.endPlayer$ = this.gameControllerService.endPlayer$;
    this.steps$ = this.gameControllerService.steps$;
    this.time$ = this.gameControllerService.time$;
    this.selectionState$ = this.gameControllerService.selectionState$;
    this.teamHistory$ = this.gameControllerService.teamHistory$;
    this.playerHistory$ = this.gameControllerService.playerHistory$;
    this.currentPlayerList$ = this.gameControllerService.currentPlayerList$;
  }

  convertMs(ms: number | null): string {
    return convertMs(ms);
  }
}
