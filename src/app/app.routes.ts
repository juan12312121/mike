import { Routes } from '@angular/router';
import { LoginComponent } from './autenticacion/login/login.component';
import { ChecadorComponent } from './checador/checador.component';
import { PrincipalComponent } from './jefe-carrera/principal/principal.component';
import { RegistroAsistenciasComponent } from './jefe-carrera/registro-asistencias/registro-asistencias.component';
import { JefegrupoComponent } from './jefe-grupo/jefegrupo/jefegrupo.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirecciona automáticamente al login
    { path: 'login', component: LoginComponent },
    { path: 'jefe-grupo', component: JefegrupoComponent },
    {path: 'checador', component: ChecadorComponent},
    {path: 'jefe-carrera', component: PrincipalComponent},
    {path: 'asistencias', component: RegistroAsistenciasComponent}
];
