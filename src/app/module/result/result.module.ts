import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultPageComponent } from '../../component/result-page/result-page.component';

@NgModule({
  declarations: [ResultPageComponent],
  imports: [CommonModule, ResultRoutingModule],
})
export class ResultModule {}
