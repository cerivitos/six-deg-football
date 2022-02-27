import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GameControllerService } from './service/game-controller.service';

@Injectable({
  providedIn: 'root',
})
export class ResultGuard implements CanActivate {
  steps: number = 0;
  stepsSubscription: Subscription | undefined;

  constructor(
    private gameControllerService: GameControllerService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    this.stepsSubscription = this.gameControllerService.steps$
      .pipe(
        tap((steps) => {
          this.steps = steps;
          this.stepsSubscription?.unsubscribe();
        })
      )
      .subscribe();

    if (this.steps < 1) {
      return this.router.parseUrl('/');
    } else {
      return true;
    }
  }
}
