import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { GamePageComponent } from '../../component/game-page/game-page.component';
import { PlayerCardComponent } from '../../component/player-card/player-card.component';
import { TeamPanelComponent } from '../../component/team-panel/team-panel.component';
import { PlayerPanelComponent } from '../../component/player-panel/player-panel.component';

@NgModule({
  declarations: [
    GamePageComponent,
    PlayerCardComponent,
    TeamPanelComponent,
    PlayerPanelComponent,
  ],
  imports: [CommonModule, GameRoutingModule],
})
export class GameModule {}
