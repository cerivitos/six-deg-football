import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultPageComponent } from '../../component/result-page/result-page.component';
import { ResultGuard } from 'src/app/result.guard';

const routes: Routes = [
  {
    path: '',
    component: ResultPageComponent,
    canActivate: [ResultGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultRoutingModule {}
