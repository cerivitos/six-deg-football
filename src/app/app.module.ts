import { HotToastModule } from '@ngneat/hot-toast';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppCheckModule } from '@angular/fire/app-check';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { StartPageComponent } from './component/start-page/start-page.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { NameCarouselComponent } from './component/name-carousel/name-carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    PageNotFoundComponent,
    NameCarouselComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AppCheckModule,
    HotToastModule.forRoot({
      theme: 'snackbar',
      position: 'bottom-center',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
