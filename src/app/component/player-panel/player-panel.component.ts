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
  @Input() isHeader: boolean = false;

  selectableClassList: string = '';

  constructor(private gameControllerService: GameControllerService) {}

  ngOnInit(): void {
    if (!this.isHeader) {
      this.selectableClassList =
        'px-4 cursor-pointer hover:bg-slate-200 active:bg-slate-300 transition-colors duration-200';
    }
  }

  onSelect(player: Player) {
    this.gameControllerService.onPlayerSelected(player);
  }
}
