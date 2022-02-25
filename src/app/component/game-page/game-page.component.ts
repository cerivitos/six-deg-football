import { Component, OnInit } from '@angular/core';

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { getApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { Player } from 'src/app/model/Player';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css'],
})
export class GamePageComponent implements OnInit {
  constructor(private dataService: DataService) {}

  startPlayer: Player | undefined;
  endPlayer: Player | undefined;

  ngOnInit(): void {
    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(environment.appCheck.key),
      isTokenAutoRefreshEnabled: true,
    });

    if (environment.production) {
      this.dataService.getPlayer(253259).then((player) => {
        this.startPlayer = player!;
      });

      this.dataService.getPlayer(261294).then((player) => {
        this.endPlayer = player!;
      });
    } else {
      this.dataService.getMockStartPlayer(253259).then((player) => {
        this.startPlayer = player!;
      });

      this.dataService.getMockEndPlayer(261294).then((player) => {
        this.endPlayer = player!;
      });
    }
  }
}
