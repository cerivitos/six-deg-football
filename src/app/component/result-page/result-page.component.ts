import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';
import { Team } from 'src/app/model/Team';
import { GameControllerService } from 'src/app/service/game-controller.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { convertSec } from 'src/app/util/convertSec';
import { environment } from 'src/environments/environment';
import { ShareService } from 'src/app/service/share.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css'],
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
    if (environment.production) {
      this.steps$ = this.gameControllerService.steps$;
      this.time$ = this.gameControllerService.time$;
      this.teamHistory$ = this.gameControllerService.teamHistory$;
      this.playerHistory$ = this.gameControllerService.playerHistory$;
    } else {
      this.steps$ = new BehaviorSubject<number>(13);
      this.time$ = new BehaviorSubject<number>(240);

      let testTeamHistory: Team[] = [];
      this._populateTestTeamData().then((data) => {
        testTeamHistory = data;
        this.teamHistory$ = new BehaviorSubject<Team[]>(testTeamHistory);
      });

      let testPlayerHistory: Player[] = [];
      this._populateTestPlayerData().then((data) => {
        testPlayerHistory = data;
        this.playerHistory$ = new BehaviorSubject<Player[]>(testPlayerHistory);
      });
    }
  }

  private async _populateTestTeamData(): Promise<Team[]> {
    const response = await fetch('../../assets/test-team-history.json');
    const testTeamHistoryJson = await response.json();
    let testTeamHistory: Team[] = [];
    for (const team of testTeamHistoryJson) {
      testTeamHistory.push(team as Team);
    }

    return testTeamHistory;
  }

  private async _populateTestPlayerData(): Promise<Player[]> {
    const response = await fetch('../../assets/test-player-history.json');
    const testPlayerHistoryJson = await response.json();
    let testPlayerHistory: Player[] = [];
    for (const player of testPlayerHistoryJson) {
      testPlayerHistory.push(player as Player);
    }

    return testPlayerHistory;
  }

  convertSec(s: number | null): string {
    return convertSec(s);
  }

  share() {
    this.shareService.share();
  }
}
