import { Routes } from '@angular/router';
import { PacientesComponent } from '../component/pacientes/pacientes.component';
import { TurnosComponent } from '../component/turnos/turnos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pacientes', pathMatch: 'full' },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'turnos', component: TurnosComponent },
];