import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css'],
  animations: [
    trigger('enterAnim', [
      transition(':enter', [
        style({ transform: 'translateY(12px)', opacity: 0.5 }),
        animate(
          '80ms ease-in',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class PlayerCardComponent implements OnInit {
  @Input() player: Player | undefined | null;

  constructor() {}

  ngOnInit(): void {}
}
