import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Player } from 'src/app/model/Player';
import { GameControllerService } from 'src/app/service/game-controller.service';
import { Observable } from 'rxjs';
import { Team } from 'src/app/model/Team';
import { convertSec } from 'src/app/util/convertSec';
import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';

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
    trigger('fabAnim', [
      transition(':enter', [
        style({ transform: 'translateY(200px)' }),
        animate('200ms ease-in-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in-out', style({ transform: 'translateY(200px)' })),
      ]),
    ]),
  ],
})
export class GamePageComponent implements OnInit {
  constructor(
    private gameControllerService: GameControllerService,
    private router: Router
  ) {}

  @ViewChild('topBar') topBar: ElementRef | undefined;

  lastScrollY: number = 0;
  scrollDirection: 'up' | 'down' = 'up';

  startPlayer$: Observable<Player | undefined> = new Observable<
    Player | undefined
  >();

  endPlayer$: Observable<Player | undefined> = new Observable<
    Player | undefined
  >();

  teamPath$: Observable<Team[]> = new Observable<Team[]>();

  steps$: Observable<number> = new Observable<number>();
  time$: Observable<number> = new Observable<number>();
  selectionState$: Observable<'team' | 'player' | 'loading' | 'error'> =
    new Observable<'team' | 'player' | 'loading' | 'error'>();

  teamHistory$: Observable<Team[]> = new Observable<Team[]>();
  playerHistory$: Observable<Player[]> = new Observable<Player[]>();

  currentPlayerList$: Observable<Player[]> = new Observable<Player[]>();

  ngOnInit() {
    this.gameControllerService.resetGame();

    if (!this.router.url.includes('/game')) {
      const playerIds: number[] = this.router.url
        .slice(1)
        .split('-')
        .map((id) => parseInt(id));
      this._initGame(playerIds[0], playerIds[1]);
    } else {
      this._initGame();
    }
  }

  private async _initGame(startPlayerId?: number, endPlayerId?: number) {
    try {
      await this.gameControllerService.initGame(startPlayerId, endPlayerId);

      this.startPlayer$ = this.gameControllerService.startPlayer$;
      this.endPlayer$ = this.gameControllerService.endPlayer$;
      this.teamPath$ = this.gameControllerService.teamPath$;
      this.steps$ = this.gameControllerService.steps$;
      this.time$ = this.gameControllerService.time$;
      this.selectionState$ = this.gameControllerService.selectionState$;
      this.teamHistory$ = this.gameControllerService.teamHistory$;
      this.playerHistory$ = this.gameControllerService.playerHistory$;
      this.currentPlayerList$ = this.gameControllerService.currentPlayerList$;
    } catch (err) {
      console.warn(err);
    }
  }

  convertSec(s: number | null): string {
    return convertSec(s);
  }

  reset() {
    this.gameControllerService.resetGame();

    if (!this.router.url.includes('/game')) {
      const playerIds: number[] = this.router.url
        .slice(1)
        .split('-')
        .map((id) => parseInt(id));
      this._initGame(playerIds[0], playerIds[1]);
    } else {
      this._initGame();
    }
  }

  onScroll(event: Event) {
    const buffer = 5;
    const scrollPosition = (event.composedPath()[1] as Window).scrollY;

    if (scrollPosition > this.lastScrollY + buffer) {
      this.scrollDirection = 'down';
    } else if (scrollPosition < this.lastScrollY - buffer) {
      this.scrollDirection = 'up';
    }

    this.lastScrollY = scrollPosition;
  }
}
