import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { GamePageComponent } from '../../component/game-page/game-page.component';
import { PlayerCardComponent } from 'src/app/component/player-card/player-card.component';
import { TeamPanelComponent } from '../../component/team-panel/team-panel.component';

@NgModule({
  declarations: [GamePageComponent, PlayerCardComponent, TeamPanelComponent],
  imports: [CommonModule, GameRoutingModule],
})
export class GameModule {}
