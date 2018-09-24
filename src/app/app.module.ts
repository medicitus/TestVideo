import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from "@angular/router";

import { AppComponent } from './app.component';

import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { IndexComponent } from "./components/index/index.component";
import { ROUTES } from "./app.routes";

import { SimpleNotificationsModule, NotificationsService } from "angular2-notifications";

import { VideoPatientComponent } from "./components/patient/video-patient.component";
import { VideoDoctorComponent } from "./components/doctor/video-doctor/video-doctor.component";

import { NetworkService } from "./services/data/network.service";
import { SocketService } from "./services/socket";
import { AudioService } from "./services/audio";
import { VideoService } from "./services/video";
import { CallService } from "./services/call";
//import { XirsysService } from "./services/data/xirsys.service";
import { UrlService } from "./services/url.service";


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavBarComponent,
    VideoPatientComponent,
    VideoDoctorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    SimpleNotificationsModule.forRoot()
  ],
  providers: [
    NetworkService,
    NotificationsService,
    SocketService,
    AudioService,
    VideoService,
    CallService,
   // XirsysService,
    UrlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
