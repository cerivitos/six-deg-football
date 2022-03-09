import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultPageComponent } from '../../component/result-page/result-page.component';
import { ResultPanelComponent } from '../../component/result-panel/result-panel.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [ResultPageComponent, ResultPanelComponent],
  imports: [CommonModule, ResultRoutingModule, ClipboardModule],
})
export class ResultModule {}
