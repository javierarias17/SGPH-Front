import { NgModule } from '@angular/core';
import { GestionarCursoComponent } from './datos/gestionar-curso/gestionar.curso.component';
import { GestionarAsignaturaComponent } from './datos/gestionar-asignatura/gestionar-asignatura.component';
import { GestionarEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/gestionar.espacio.fisico.component';
import { GestionarDocenteComponent } from './datos/gestionar-docente/gestionar.docente.component';
import { CrearEditarVerCursoComponent } from './datos/gestionar-curso/crear-editar-consultar-curso/crear.editar.ver.curso.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { CrearPeriodoAcademicoComponent } from './periodo-academico/crear-periodo-academico/crear.periodo.academico.component';
import { GestionarGrupoComponent } from './datos/gestionar-grupo/gestionar.grupo.component';
import { PlanificacionManualComponent } from './planificacion-horario/planificacion-manual/planificacion.manual.component';
import { PlanificacionSemestreAnteriorComponent } from './planificacion-horario/planificacion-semestre-anterior/planificacion.semestre.anterior.component';
import { GenerarReporteDocenteComponent } from './reportes/generar-reporte-docente/generar.reporte.docente.component';
import { GenerarReporteSimcaComponent } from './reportes/generar-reporte-simca/generar.reporte.simca.component';
import { GestionarReservaTemporalComponent } from './reservas/gestionar-reserva-temporal/gestionar.reserva.temporal.component';
import { GestionarReservaFacultadComponent } from './reservas/gestionar-reserva-facultad/gestionar.reserva.facultad.component';
import { GestionarUsuarioComponent } from './seguridad/gestionar-usuario/gestionar.usuario.component';
import { AsociarDocenteComponent } from './planificacion-horario/planificacion-manual/asociar-docente/asociar.docente.component';
import { HorarioDocenteComponent } from './datos/gestionar-docente/horario-docente/horario.docente.component';
import { CrearEditarVerDocenteComponent } from './datos/gestionar-docente/crear-editar-ver-docente/crear.editar.ver.docente.component';
import { HorarioEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/horario-espacio-fisico/horario.espacio.fisico.component';
import { CrearEditarVerUsuarioComponent } from './seguridad/gestionar-usuario/crear-editar-ver-usuario/crear.editar.ver.usuario.component';
import { AsociarEspacioFisicoComponent } from './planificacion-horario/planificacion-manual/asociar-espacio-fisico/asociar.espacio.fisico.component';
import { CargarLaborDocenciaComponent } from './datos/cargar-labor-docencia/cargar.labor.docencia.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [
		GestionarCursoComponent,
		GestionarAsignaturaComponent,
		GestionarDocenteComponent,
		GestionarEspacioFisicoComponent,
		AsociarEspacioFisicoComponent,
		AsociarDocenteComponent,
		CrearEditarVerCursoComponent,
		InicioComponent,
		CrearPeriodoAcademicoComponent,
		GestionarGrupoComponent,
		CargarLaborDocenciaComponent,
		PlanificacionManualComponent,
		PlanificacionSemestreAnteriorComponent,
		PlanificacionSemestreAnteriorComponent,
		GenerarReporteSimcaComponent,
		GenerarReporteDocenteComponent,
		GenerarReporteSimcaComponent,
		GestionarReservaTemporalComponent,
		GestionarReservaFacultadComponent,
		GestionarUsuarioComponent,
		HorarioDocenteComponent,
		CrearEditarVerDocenteComponent,
		HorarioEspacioFisicoComponent,
		CrearEditarVerUsuarioComponent,
	],
	imports: [
		CommonModule,
		PrimeNgModule
	]
})
export class ComponentesModule { }
