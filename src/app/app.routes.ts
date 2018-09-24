import { Routes, RouterModule, CanDeactivate } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";

import { IndexComponent } from "./components/index/index.component";

import { VideoPatientComponent } from "./components/patient/video-patient.component";
import { VideoDoctorComponent } from "./components/doctor/video-doctor/video-doctor.component";


export const ROUTES: Routes = [

  { path: '', component: IndexComponent },

  { path: 'patient', component: VideoPatientComponent },
  { path: 'doctor', component: VideoDoctorComponent },

  { path: '**', component: IndexComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTES);
