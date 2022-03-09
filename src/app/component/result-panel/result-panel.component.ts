import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-panel',
  templateUrl: './result-panel.component.html',
  styleUrls: ['./result-panel.component.css'],
  animations: [
    trigger('resultEnterAnim', [
      transition(':enter', [
        style({ filter: 'grayscale(80%)', opacity: 0.8 }),
        animate('160ms', style({ filter: 'grayscale(0%)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class ResultPanelComponent implements OnInit {
  @Input() playerName: string | undefined;
  @Input() playerImg: string | undefined;
  @Input() teamName: string | undefined;
  @Input() teamImg: string | undefined;
  @Input() season: string | undefined;
  @Input() showBackground: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
