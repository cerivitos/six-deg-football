import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css'],
})
export class PlayerCardComponent implements OnInit {
  @Input() player: Player | undefined;
  season: string = '';

  constructor() {}

  ngOnInit(): void {
    const currentTeamId: string = this.player!.history[0].teamId;
    this.season = currentTeamId.slice(currentTeamId.lastIndexOf('-') + 1);
  }
}
