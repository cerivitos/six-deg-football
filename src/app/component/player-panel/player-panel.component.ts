import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/model/Player';
import { GameControllerService } from 'src/app/service/game-controller.service';

@Component({
  selector: 'app-player-panel',
  templateUrl: './player-panel.component.html',
  styleUrls: ['./player-panel.component.css'],
  animations: [
    trigger('playerEnterAnim', [
      transition(':enter', [
        style({ transform: 'translateX(30px)', opacity: 0 }),
        animate('100ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
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
