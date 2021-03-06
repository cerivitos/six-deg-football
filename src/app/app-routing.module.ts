import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { StartPageComponent } from './component/start-page/start-page.component';
import { TermsComponent } from './component/terms/terms.component';

const routes: Routes = [
  {
    path: '',
    component: StartPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./module/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'game',
    loadChildren: () =>
      import('./module/game/game.module').then((m) => m.GameModule),
  },
  {
    path: 'result',
    loadChildren: () =>
      import('./module/result/result.module').then((m) => m.ResultModule),
  },
  {
    path: 'terms',
    component: TermsComponent,
    pathMatch: 'full',
  },
  {
    path: ':gameId',
    loadChildren: () =>
      import('./module/game/game.module').then((m) => m.GameModule),
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
