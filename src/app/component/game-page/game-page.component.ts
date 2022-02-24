import { Component, OnInit } from '@angular/core';

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { getApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Player } from 'src/app/model/Player';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css'],
})
export class GamePageComponent implements OnInit {
  constructor(private dataService: DataService) {}

  player: Player | undefined;

  ngOnInit(): void {
    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(environment.appCheck.key),
      isTokenAutoRefreshEnabled: true,
    });

    this.dataService.getPlayer(169152).then((player) => {
      this.player = player!;
    });
  }
}
