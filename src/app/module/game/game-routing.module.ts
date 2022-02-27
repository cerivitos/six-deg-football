import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from '../../component/game-page/game-page.component';

const routes: Routes = [
  { path: '', component: GamePageComponent },
  {
    path: 'result',
    loadChildren: () =>
      import('../result/result.module').then((m) => m.ResultModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
