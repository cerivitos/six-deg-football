import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-name-carousel',
  templateUrl: './name-carousel.component.html',
  styleUrls: ['./name-carousel.component.css'],
  animations: [
    trigger('name1Anim', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate(
          '1500ms',
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 1, offset: 0.1 }),
            style({ opacity: 1, offset: 0.9 }),
            style({ opacity: 0, offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('name2Anim', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate(
          '2000ms',
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 1, offset: 0.1 }),
            style({ opacity: 1, offset: 0.9 }),
            style({ opacity: 0, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class NameCarouselComponent implements OnInit {
  constructor() {}

  name1: string = '';
  name2: string = '';

  names: string[] = [
    'messi',
    'ronaldo',
    'lewandowski',
    'haaland',
    'rashford',
    'sancho',
    'neymar',
    'mbappe',
    'kroos',
    'modric',
    'hazard',
    'pogba',
    'kane',
    'ibrahimovic',
    'salah',
    'drogba',
    'hazard',
    'kroos',
    'foden',
    'gavi',
    'iniesta',
    'rooney',
    'henry',
    'lampard',
    'xavi',
    'ronaldinho',
    'ramos',
    'mane',
    'ederson',
    'pedro',
    'benzema',
    'marcelo',
    'kaka',
    'coutinho',
    'modric',
  ];

  ngOnInit(): void {
    let index1 = Math.floor(Math.random() * this.names.length);
    let index2 = Math.min(index1 + 1, this.names.length - 1);

    this.name1 = this.names[index1];
    this.name2 = this.names[index2];

    setInterval(() => {
      if (index1 + 1 < this.names.length) {
        if (index1 + 1 !== index2) {
          index1++;
        } else {
          index1 += 2;
        }
      } else {
        index1 = 0;
      }

      this.name1 = this.names[index1];
    }, 1500);

    setInterval(() => {
      if (index2 + 1 < this.names.length) {
        if (index2 + 1 !== index1) {
          index2++;
        } else {
          index2 += 2;
        }
      } else {
        index2 = 0;
      }
      this.name2 = this.names[index2];
    }, 2000);
  }
}
