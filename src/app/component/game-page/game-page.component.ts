import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { getApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { Player } from 'src/app/model/Player';
import { GameControllerService } from 'src/app/service/game-controller.service';
import { Observable } from 'rxjs';
import { Team } from 'src/app/model/Team';
import { convertSec } from 'src/app/util/convertSec';
import { WINDOW } from '@ng-web-apis/common';
import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css'],
  animations: [
    trigger('playerListAnim', [
      transition(':enter,:leave', [
        query('@playerEnterAnim', [stagger(40, [animateChild()])], {
          optional: true,
        }),
      ]),
      transition(':leave', [animate('40ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('teamListAnim', [
      transition(':enter,:leave', [
        query('@teamEnterAnim', [stagger(40, [animateChild()])], {
          optional: true,
        }),
      ]),
      transition(':leave', [animate('40ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class GamePageComponent implements OnInit {
  constructor(
    private gameControllerService: GameControllerService,
    @Inject(WINDOW) readonly windowRef: any
  ) {}

  @ViewChild('topBar') topBar: ElementRef | undefined;

  topBarHeight: number = 0;

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
    if (location.hostname === 'localhost') {
      this.windowRef.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(environment.appCheck.key),
      isTokenAutoRefreshEnabled: true,
    });

    this.initGame(20801, 239085);
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

  convertSec(s: number | null): string {
    return convertSec(s);
  }
}
