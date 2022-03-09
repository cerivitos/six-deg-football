import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';
import { Team } from 'src/app/model/Team';
import { GameControllerService } from 'src/app/service/game-controller.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { convertSec } from 'src/app/util/convertSec';
import { environment } from 'src/environments/environment';
import { ShareService } from 'src/app/service/share.service';
import {
  animateChild,
  query,
  stagger,
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
