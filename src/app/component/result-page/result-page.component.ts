import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';
import { Team } from 'src/app/model/Team';
import { GameControllerService } from 'src/app/service/game-controller.service';
import { Observable, of } from 'rxjs';
import { convertSec } from 'src/app/util/convertSec';
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
import { take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
        style({ transform: 'scale(4.8)', opacity: 0 }),
        animate(
          '160ms 80ms ease-in',
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

  isSharing: boolean = false;

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
      const mockTeams: Team[] = [
        {
          teamName: 'Canada',
          teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
          teamId: '111455-2021/2022',
        },
        {
          teamId: '111455-2020/2021',
          teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
          teamName: 'Canada',
        },
        {
          teamId: '111455-2019/2020',
          teamName: 'Canada',
          teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
        },
        {
          teamName: 'Canada',
          teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
          teamId: '111455-2017/2018',
        },
      ];

      const mockPlayers: Player[] = [
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
          playerImg: 'https://cdn.sofifa.net/players/212/358/19_120.png',
          playerId: 212358,
          history: [
            {
              teamName: 'Canada',
              teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
              teamId: '111455-2018/2019',
            },
            {
              teamId: '111139-2018/2019',
              teamName: 'Club de Foot Montréal',
              teamImg: 'https://cdn.sofifa.net/teams/111139/30.png',
            },
            {
              teamId: '111139-2017/2018',
              teamImg: 'https://cdn.sofifa.net/teams/111139/30.png',
              teamName: 'Club de Foot Montréal',
            },
            {
              teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
              teamName: 'Canada',
              teamId: '111455-2017/2018',
            },
            {
              teamImg: 'https://cdn.sofifa.net/teams/15/30.png',
              teamName: 'Queens Park Rangers',
              teamId: '15-2017/2018',
            },
            {
              teamImg: 'https://cdn.sofifa.net/teams/15/30.png',
              teamName: 'Queens Park Rangers',
              teamId: '15-2016/2017',
            },
            {
              teamImg: 'https://cdn.sofifa.net/teams/15/30.png',
              teamName: 'Queens Park Rangers',
              teamId: '15-2015/2016',
            },
            {
              teamName: 'Canada',
              teamId: '111455-2015/2016',
              teamImg: 'https://cdn.sofifa.net/teams/111455/30.png',
            },
            {
              teamName: 'Notts County',
              teamId: '1937-2014/2015',
              teamImg: 'https://cdn.sofifa.net/teams/1937/30.png',
            },
            {
              teamImg: 'https://cdn.sofifa.net/teams/1958/30.png',
              teamName: 'Leyton Orient',
              teamId: '1958-2014/2015',
            },
            {
              teamName: 'Queens Park Rangers',
              teamImg: 'https://cdn.sofifa.net/teams/15/30.png',
              teamId: '15-2014/2015',
            },
            {
              teamName: 'Queens Park Rangers',
              teamId: '15-2013/2014',
              teamImg: 'https://cdn.sofifa.net/teams/15/30.png',
            },
            {
              teamImg: 'https://cdn.sofifa.net/teams/1800/30.png',
              teamName: 'Coventry City',
              teamId: '1800-2013/2014',
            },
            {
              teamName: 'Oldham Athletic',
              teamImg: 'https://cdn.sofifa.net/teams/1920/30.png',
              teamId: '1920-2013/2014',
            },
            {
              teamName: 'Queens Park Rangers',
              teamId: '15-2012/2013',
              teamImg: 'https://cdn.sofifa.net/teams/15/30.png',
            },
          ],
          playerName: 'Michael Petrasso',
        },
      ];
      this.teamHistory$ = of(mockTeams);
      this.playerHistory$ = of(mockPlayers);
    }
  }

  convertSec(s: number | null): string {
    return convertSec(s);
  }

  async share() {
    this.isSharing = true;
    await this.shareService.share();
    this.isSharing = false;
  }
}
