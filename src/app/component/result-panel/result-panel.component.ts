import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-panel',
  templateUrl: './result-panel.component.html',
  styleUrls: ['./result-panel.component.css'],
})
export class ResultPanelComponent implements OnInit {
  @Input() playerName: string | undefined;
  @Input() playerImg: string | undefined;
  @Input() teamName: string | undefined;
  @Input() teamImg: string | undefined;
  @Input() season: string | undefined;

  constructor() {}

  ngOnInit(): void {}
}