import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { TurnosComponent } from './features/turnos/turnos.component';
import { AboutComponent } from './features/about/about.component';
import { CuidadosComponent } from './features/cuidados/cuidados.component';
import { GestionarTurnoComponent } from './features/gestionar-turno/gestionar-turno.component';
import { FlashComponent } from './features/flash/flash.component';
import { hasFlash } from './shared/flash';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'MNK Ink | Tatuajes black & grey, minimal y lettering' },
  { path: 'gallery', component: GalleryComponent, title: 'Trabajos | MNK Ink' },
  // Flash: la ruta solo existe si hay diseños cargados (si no, /flash cae en '**' y va al inicio).
  { path: 'flash', component: FlashComponent, canMatch: [() => hasFlash()], title: 'Flash | MNK Ink' },
  { path: 'turnos', component: TurnosComponent, title: 'Solicitar turno | MNK Ink' },
  { path: 'turnos/gestionar', component: GestionarTurnoComponent, title: 'Gestionar mi turno | MNK Ink' },
  { path: 'cuidados', component: CuidadosComponent, title: 'Cuidados y preguntas frecuentes | MNK Ink' },
  { path: 'about', component: AboutComponent, title: 'Sobre mí | MNK Ink' },
  { path: '**', redirectTo: '' }
];
