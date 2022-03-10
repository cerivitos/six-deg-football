import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';
import { Team } from 'src/app/model/Team';
import { GameControllerService } from 'src/app/service/game-controller.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { convertSec } from 'src/app/util/convertSec';
import { environment } from 'src/environments/environment';
import { ShareService } from 'src/app/service/share.service';
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
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css'],
  animations: [
    trigger('resultListAnim', [
      transition(':enter', [
        query('@resultEnterAnim', [stagger(80, [animateChild()])], {
          optional: true,
        }),
      ]),
    ]),
    trigger('scoreAnim', [
      transition(':enter', [
        style({ transform: 'scale(5)', opacity: 0.7 }),
        animate('160ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
    trigger('timeAnim', [
      transition(':enter', [
        style({ transform: 'scale(4.8)', opacity: 0.7 }),
        animate(
          '160ms 30ms ease-in',
          style({ transform: 'scale(1)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class ResultPageComponent implements OnInit {
  steps$: Observable<number> = new Observable<number>();
  time$: Observable<number> = new Observable<number>();
  teamHistory$: Observable<Team[]> = new Observable<Team[]>();
  playerHistory$: Observable<Player[]> = new Observable<Player[]>();

  constructor(
    private gameControllerService: GameControllerService,
    private shareService: ShareService
  ) {}

  ngOnInit(): void {
    this.steps$ = this.gameControllerService.steps$;
    this.time$ = this.gameControllerService.time$;
    this.teamHistory$ = this.gameControllerService.teamHistory$;
    this.playerHistory$ = this.gameControllerService.playerHistory$;
  }

  convertSec(s: number | null): string {
    return convertSec(s);
  }

  share() {
    this.shareService.share();
  }
}
