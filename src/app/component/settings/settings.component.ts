import { Component, Inject, OnInit } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { Player } from 'src/app/model/Player';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  customStartPlayer: Player | undefined;
  difficulty: number = 1;

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  ngOnInit(): void {
    const savedPlayer = this.localStorage.getItem('customStartPlayer');
    if (savedPlayer) {
      this.customStartPlayer = JSON.parse(savedPlayer) as Player;
    }

    const savedDifficulty = this.localStorage.getItem('difficulty');
    if (savedDifficulty) {
      this.difficulty = parseInt(savedDifficulty);
    }
  }
}
