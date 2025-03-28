import { Routes } from '@angular/router';
import { LoginComponent } from './autenticacion/login/login.component';
import { ChecadorComponent } from './checador/checador.component';
import { MateriasComponent } from './jefe-carrera/materias/materias.component';
import { PrincipalComponent } from './jefe-carrera/principal/principal.component';
import { ProfesoresComponent } from './jefe-carrera/profesores/profesores.component';
import { RegistroAsistenciasComponent } from './jefe-carrera/registro-asistencias/registro-asistencias.component';
import { JefegrupoComponent } from './jefe-grupo/jefegrupo/jefegrupo.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'jefe-grupo', component: JefegrupoComponent },
  { path: 'checador', component: ChecadorComponent },
  { path: 'jefe-carrera', component: PrincipalComponent },
  { path: 'asistencias', component: RegistroAsistenciasComponent },
  {path: 'profesores', component: ProfesoresComponent},
  {path: 'materias', component: MateriasComponent}
];
