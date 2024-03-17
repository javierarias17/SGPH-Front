import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionarCursoComponent } from './datos/gestionar-curso/gestionar.curso.component';
import { GestionarAsignaturaComponent } from './datos/gestionar-asignatura/gestionar-asignatura.component';
import { GestionarDocenteComponent } from './datos/gestionar-docente/gestionar.docente.component';
import { GestionarEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/gestionar.espacio.fisico.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { CrearPeriodoAcademicoComponent } from './periodo-academico/crear-periodo-academico/crear.periodo.academico.component';
import { GestionarGrupoComponent } from './datos/gestionar-grupo/gestionar.grupo.component';
import { PlanificacionManualComponent } from './planificacion-horario/planificacion-manual/planificacion.manual.component';
import { PlanificacionSemestreAnteriorComponent } from './planificacion-horario/planificacion-semestre-anterior/planificacion.semestre.anterior.component';
import { GestionarUsuarioComponent } from './seguridad/gestionar-usuario/gestionar.usuario.component';
import { GestionarReservaFacultadComponent } from './reservas/gestionar-reserva-facultad/gestionar.reserva.facultad.component';
import { GestionarReservaTemporalComponent } from './reservas/gestionar-reserva-temporal/gestionar.reserva.temporal.component';
import { GenerarReporteSimcaComponent } from './reportes/generar-reporte-simca/generar.reporte.simca.component';
import { GenerarReporteDocenteComponent } from './reportes/generar-reporte-docente/generar.reporte.docente.component';
import { GenerarReporteEspacioFisicoComponent } from './reportes/generar-reporte-espacio-fisico/generar.reporte.espacio.fisico.component';
import { CargarLaborDocenciaComponent } from './datos/cargar-labor-docencia/cargar.labor.docencia.component';


const routes: Routes=[
    { path: 'inicio', component: InicioComponent},
    { path: 'crear-periodo-academico', component: CrearPeriodoAcademicoComponent},
    { path: 'cargar-labor-docencia', component: CargarLaborDocenciaComponent},
    { path: 'gestionar-espacio-fisico', component: GestionarEspacioFisicoComponent},
    { path: 'gestionar-asignatura', component: GestionarAsignaturaComponent},
    { path: 'gestionar-curso', component: GestionarCursoComponent},
    { path: 'gestionar-docente', component: GestionarDocenteComponent},
    { path: 'gestionar-grupo', component: GestionarGrupoComponent},
    { path: 'planificacion-manual', component: PlanificacionManualComponent},
    { path: 'planificacion-semestre-anterior', component: PlanificacionSemestreAnteriorComponent},
    { path: 'generar-reporte-espacio-fisico', component: GenerarReporteEspacioFisicoComponent},
    { path: 'generar-reporte-docente', component: GenerarReporteDocenteComponent},
    { path: 'generar-reporte-simca', component: GenerarReporteSimcaComponent},
    { path: 'gestionar-reserva-temporal', component: GestionarReservaTemporalComponent},
    { path: 'gestionar-reserva-facultad', component: GestionarReservaFacultadComponent},
    { path: 'gestionar-usuario', component: GestionarUsuarioComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComponentesRoutingModule { }