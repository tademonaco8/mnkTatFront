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
  { path: '', component: HomeComponent, title: 'MNK Tattoo | Tatuajes black & grey, minimal y lettering' },
  { path: 'gallery', component: GalleryComponent, title: 'Trabajos | MNK Tattoo' },
  // Flash: la ruta solo existe si hay diseños cargados (si no, /flash cae en '**' y va al inicio).
  { path: 'flash', component: FlashComponent, canMatch: [() => hasFlash()], title: 'Flash | MNK Tattoo' },
  { path: 'turnos', component: TurnosComponent, title: 'Solicitar turno | MNK Tattoo' },
  { path: 'turnos/gestionar', component: GestionarTurnoComponent, title: 'Gestionar mi turno | MNK Tattoo' },
  { path: 'cuidados', component: CuidadosComponent, title: 'Cuidados y preguntas frecuentes | MNK Tattoo' },
  { path: 'about', component: AboutComponent, title: 'Sobre mí | MNK Tattoo' },
  { path: '**', redirectTo: '' }
];
