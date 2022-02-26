import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';
import { GameControllerService } from 'src/app/service/game-controller.service';

@Component({
  selector: 'app-player-panel',
  templateUrl: './player-panel.component.html',
  styleUrls: ['./player-panel.component.css'],
})
export class PlayerPanelComponent implements OnInit {
  @Input() player: Player | undefined;

  constructor(private gameControllerService: GameControllerService) {}

  ngOnInit(): void {}

  onSelect(player: Player) {
    this.gameControllerService.onPlayerSelected(player);
  }
}
