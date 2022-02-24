import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { GamePageComponent } from '../../component/game-page/game-page.component';

@NgModule({
  declarations: [GamePageComponent],
  imports: [CommonModule, GameRoutingModule],
})
export class GameModule {}
