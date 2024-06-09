import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionarCursoComponent } from './datos/gestionar-curso/gestionar.curso.component';
import { GestionarDocenteComponent } from './datos/gestionar-docente/gestionar.docente.component';
import { GestionarEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/gestionar.espacio.fisico.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { GestionarGrupoComponent } from './datos/gestionar-grupo/gestionar.grupo.component';
import { PlanificacionManualComponent } from './planificacion-horario/planificacion-manual/planificacion.manual.component';
import { PlanificacionSemestreAnteriorComponent } from './planificacion-horario/planificacion-semestre-anterior/planificacion.semestre.anterior.component';
import { GestionarUsuarioComponent } from './seguridad/gestionar-usuario/gestionar.usuario.component';
import { GestionarReservaFacultadComponent } from './reservas/gestionar-reserva-facultad/gestionar.reserva.facultad.component';
import { GestionarReservaTemporalComponent } from './reservas/gestionar-reserva-temporal/gestionar.reserva.temporal.component';
import { GenerarReporteSimcaComponent } from './reportes/generar-reporte-simca/generar.reporte.simca.component';
import { CargarLaborDocenciaComponent } from './datos/cargar-labor-docencia/cargar.labor.docencia.component';
import { BandejaReporteEspacioFisicoComponent } from './reportes/reporte-espacio-fisico/bandeja-reporte-espacio-fisico.component';
import { BandejaReporteDocenteComponent } from './reportes/reporte-docente/bandeja-reporte-docente.component';
import { EliminarHorarioProgramaComponent } from './planificacion-horario/eliminar-horario-programa/eliminar-horario-programa.component';

const routes: Routes=[
    { path: 'inicio', component: InicioComponent},
    { path: 'cargar-labor-docencia', component: CargarLaborDocenciaComponent},
    { path: 'gestionar-espacio-fisico', component: GestionarEspacioFisicoComponent},
    { path: 'gestionar-curso', component: GestionarCursoComponent},
    { path: 'gestionar-docente', component: GestionarDocenteComponent},
    { path: 'gestionar-grupo', component: GestionarGrupoComponent},
    { path: 'planificacion-manual', component: PlanificacionManualComponent},
    { path: 'planificacion-semestre-anterior', component: PlanificacionSemestreAnteriorComponent},
    { path: 'horario-espacio-fisico', component: BandejaReporteEspacioFisicoComponent},
    { path: 'eliminar-horario-programa', component: EliminarHorarioProgramaComponent},
    { path: 'horario-docente', component: BandejaReporteDocenteComponent},
    { path: 'generar-reporte-simca', component: GenerarReporteSimcaComponent},
    { path: 'gestionar-reserva-temporal', component: GestionarReservaTemporalComponent},
    { path: 'gestionar-reserva-facultad', component: GestionarReservaFacultadComponent},
    { path: 'gestionar-usuario', component: GestionarUsuarioComponent},
    {
      path: 'gestionar-periodo-academico',
      loadChildren: () =>
        import(
          "./periodo-academico/gestionar-periodo-academico/gestionar-periodo-academico.module"
        ).then((m) => m.GestionarPeriodoAcademicoModule)
    },
    {
        path: 'gestionar-asignatura',
        loadChildren: () =>
          import(
            "./datos/gestionar-asignatura/gestionar-asignatura.module"
          ).then((m) => m.GestionarAsignaturaModule)
    },
    {
      path: 'gestionar-grupos',
      loadChildren: () =>
        import(
          "./planificacion-horario/gestion-grupos/gestion-grupos.module"
        ).then((m) => m.GestionGruposModule)
  }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComponentesRoutingModule { }