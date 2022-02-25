import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css'],
})
export class PlayerCardComponent implements OnInit {
  @Input() player: Player | undefined;

  constructor() {}

  ngOnInit(): void {}
}
