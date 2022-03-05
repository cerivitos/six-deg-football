import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Team } from 'src/app/model/Team';
import { GameControllerService } from 'src/app/service/game-controller.service';

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css'],
  animations: [
    trigger('teamEnterAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class TeamPanelComponent implements OnInit {
  @Input() team!: Team;
  @Input() isHeader: boolean = false;

  season: string = '';
  selectableClassList: string = '';

  constructor(private gameControllerService: GameControllerService) {}

  ngOnInit(): void {
    const teamId = this.team!.teamId;
    this.season = teamId.slice(teamId.lastIndexOf('-') + 1);

    if (!this.isHeader) {
      this.selectableClassList =
        'cursor-pointer hover:bg-slate-200 active:bg-slate-300 transition-colors duration-200';
    }
  }

  onSelect(team: Team) {
    this.gameControllerService.onTeamSelected(team);
  }
}
