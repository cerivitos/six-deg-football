import { Component, Input, OnInit } from '@angular/core';
import { Team } from 'src/app/model/Team';

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css'],
})
export class TeamPanelComponent implements OnInit {
  @Input() team: Team | undefined;
  season: string = '';

  constructor() {}

  ngOnInit(): void {
    const teamId = this.team!.teamId;
    this.season = teamId.slice(teamId.lastIndexOf('-') + 1);
  }
}
