import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { TurnosComponent } from './features/turnos/turnos.component';
import { AboutComponent } from './features/about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'turnos', component: TurnosComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
