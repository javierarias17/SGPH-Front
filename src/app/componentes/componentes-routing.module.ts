import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionarCursoComponent } from './datos/gestionar-curso/pages/gestionar.curso.component';
import { GestionarDocenteComponent } from './datos/gestionar-docente/pages/gestionar.docente.component';
import { GestionarEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/pages/gestionar.espacio.fisico.component';
import { InicioComponent } from './home/pages/inicio.component';
import { PlanificacionManualComponent } from './planificacion-horario/planificacion-manual/pages/planificacion.manual.component';
import { PlanificacionSemestreAnteriorComponent } from './planificacion-horario/generacion-semestre-anterior/pages/planificacion.semestre.anterior.component';
import { GestionarUsuarioComponent } from './seguridad/gestionar-usuario/pages/gestionar.usuario.component';
import { GestionarReservaTemporalComponent } from './reservas/gestionar-reserva-temporal/gestionar.reserva.temporal.component';
import { GenerarReporteSimcaComponent } from './reportes/generar-reporte-simca/pages/generar.reporte.simca.component';
import { CargarLaborDocenciaComponent } from './datos/cargar-labor-docencia/pages/cargar.labor.docencia.component';
import { BandejaReporteEspacioFisicoComponent } from './reportes/ver-horario-espacio-fisico/pages/bandeja-reporte-espacio-fisico.component';
import { BandejaReporteDocenteComponent } from './reportes/ver-horario-docente/pages/bandeja-reporte-docente.component';
import { EliminarHorarioProgramaComponent } from './planificacion-horario/eliminar-horario-programa/pages/eliminar-horario-programa.component';
import { GenerarReporteDocenteComponent } from './reportes/generar-reporte-docente/pages/generar.reporte.docente.component';


const routes: Routes=[
    { path: 'inicio', component: InicioComponent},
    { path: 'cargar-labor-docencia', component: CargarLaborDocenciaComponent},
    { path: 'gestionar-espacio-fisico', component: GestionarEspacioFisicoComponent},
    { path: 'gestionar-curso', component: GestionarCursoComponent},
    { path: 'gestionar-docente', component: GestionarDocenteComponent},
    { path: 'planificacion-manual', component: PlanificacionManualComponent},
    { path: 'planificacion-semestre-anterior', component: PlanificacionSemestreAnteriorComponent},
    { path: 'horario-espacio-fisico', component: BandejaReporteEspacioFisicoComponent},
    { path: 'eliminar-horario-programa', component: EliminarHorarioProgramaComponent},
    { path: 'horario-docente', component: BandejaReporteDocenteComponent},
    { path: 'generar-reporte-simca', component: GenerarReporteSimcaComponent},
    { path: 'generar-reporte-docente', component: GenerarReporteDocenteComponent},
    { path: 'gestionar-reserva-temporal', component: GestionarReservaTemporalComponent},
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
          "./planificacion-horario/gestionar-agrupadores/gestion-grupos.module"
        ).then((m) => m.GestionGruposModule)
    },
    {
      path: 'gestionar-persona',
      loadChildren: () =>
        import(
          "./datos/gestionar-persona/gestionar-persona.module"
        ).then((m) => m.GestionarPersonaModule)
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComponentesRoutingModule { }