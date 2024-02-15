import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GestionarCursoComponent } from './datos/gestionar-curso/gestionar-curso.component';
import { GestionarAsignaturaComponent } from './datos/gestionar-asignatura/gestionar-asignatura.component';
import { GestionarDocenteComponent } from './datos/gestionar-docente/gestionar-docente.component';
import { GestionarAulaComponent } from './datos/gestionar-aula/gestionar-aula.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { CrearPeriodoAcademicoComponent } from './periodo-academico/crear-periodo-academico/crear-periodo-academico.component';
import { GestionarGrupoComponent } from './datos/gestionar-grupo/gestionar-grupo.component';
import { CargarLaborDocenteComponent } from './datos/cargar-labor-docente/cargar-labor-docente.component';
import { PlanificacionManualComponent } from './planificacion-horario/planificacion-manual/planificacion-manual.component';
import { PlanificacionSemestreAnteriorComponent } from './planificacion-horario/planificacion-semestre-anterior/planificacion-semestre-anterior.component';
import { PlanificacionSemestreAutomaticaComponent } from './planificacion-horario/planificacion-semestre-automatica/planificacion-semestre-automatica.component';
import { GestionarUsuarioComponent } from './seguridad/gestionar-usuario/gestionar-usuario.component';
import { GestionarReservaFacultadComponent } from './reservas/gestionar-reserva-facultad/gestionar-reserva-facultad.component';
import { GestionarReservaTemporalComponent } from './reservas/gestionar-reserva-temporal/gestionar-reserva-temporal.component';
import { GenerarReporteSimcaComponent } from './reportes/generar-reporte-simca/generar-reporte-simca.component';
import { GenerarReporteDocenteComponent } from './reportes/generar-reporte-docente/generar-reporte-docente.component';
import { GenerarReporteAulaComponent } from './reportes/generar-reporte-aula/generar-reporte-aula.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'inicio', component: InicioComponent},
        { path: 'crear-periodo-academico', component: CrearPeriodoAcademicoComponent},
        { path: 'cargar-labor-docente', component: CargarLaborDocenteComponent},
        { path: 'gestionar-aula', component: GestionarAulaComponent},
        { path: 'gestionar-asignatura', component: GestionarAsignaturaComponent},
        { path: 'gestionar-curso', component: GestionarCursoComponent},
        { path: 'gestionar-docente', component: GestionarDocenteComponent},
        { path: 'gestionar-grupo', component: GestionarGrupoComponent},
        { path: 'planificacion-manual', component: PlanificacionManualComponent},
        { path: 'planificacion-semestre-anterior', component: PlanificacionSemestreAnteriorComponent},
        { path: 'planificacion-automatica', component: PlanificacionSemestreAutomaticaComponent},
        { path: 'generar-reporte-aula', component: GenerarReporteAulaComponent},
        { path: 'generar-reporte-docente', component: GenerarReporteDocenteComponent},
        { path: 'generar-reporte-simca', component: GenerarReporteSimcaComponent},
        { path: 'gestionar-reserva-temporal', component: GestionarReservaTemporalComponent},
        { path: 'gestionar-reserva-facultad', component: GestionarReservaFacultadComponent},
        { path: 'gestionar-usuario', component: GestionarUsuarioComponent},
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ComponentesRoutingModule { }