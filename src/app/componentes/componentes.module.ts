import { NgModule } from '@angular/core';
import { GestionarCursoComponent } from './datos/gestionar-curso/gestionar.curso.component';
import { GestionarEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/gestionar.espacio.fisico.component';
import { GestionarDocenteComponent } from './datos/gestionar-docente/gestionar.docente.component';
import { CrearEditarVerCursoComponent } from './datos/gestionar-curso/crear-editar-consultar-curso/crear.editar.ver.curso.component';
import { InicioComponent } from './home/inicio/inicio.component';

import { GestionarGrupoComponent } from './datos/gestionar-grupo/gestionar.grupo.component';
import { PlanificacionManualComponent } from './planificacion-horario/planificacion-manual/planificacion.manual.component';
import { PlanificacionSemestreAnteriorComponent } from './planificacion-horario/planificacion-semestre-anterior/planificacion.semestre.anterior.component';
import { GenerarReporteSimcaComponent } from './reportes/generar-reporte-simca/generar.reporte.simca.component';
import { GestionarReservaTemporalComponent } from './reservas/gestionar-reserva-temporal/gestionar.reserva.temporal.component';
import { GestionarReservaFacultadComponent } from './reservas/gestionar-reserva-facultad/gestionar.reserva.facultad.component';
import { GestionarUsuarioComponent } from './seguridad/gestionar-usuario/gestionar.usuario.component';
import { AsociarDocenteComponent } from './planificacion-horario/planificacion-manual/asociar-docente/asociar.docente.component';

import { HorarioEspacioFisicoComponent } from './reportes/reporte-espacio-fisico/horario-espacio-fisico/horario.espacio.fisico.component';
import { CrearEditarVerUsuarioComponent } from './seguridad/gestionar-usuario/crear-editar-ver-usuario/crear.editar.ver.usuario.component';
import { AsociarEspacioFisicoComponent } from './planificacion-horario/planificacion-manual/asociar-espacio-fisico/asociar.espacio.fisico.component';
import { CargarLaborDocenciaComponent } from './datos/cargar-labor-docencia/cargar.labor.docencia.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CrearEditarEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/crear-editar-espacio-fisico/crear-editar-espacio-fisico.component';
import { HorarioDocenteComponent } from './reportes/reporte-docente/horario-docente/horario.docente.component';
import { BandejaReporteDocenteComponent } from './reportes/reporte-docente/bandeja-reporte-docente.component';
import { BandejaReporteEspacioFisicoComponent } from './reportes/reporte-espacio-fisico/bandeja-reporte-espacio-fisico.component';
import { ProgramaService } from './servicios/programa.service';
import { SharedService } from '../shared/service/shared.service';
import { PeriodoAcademicoService } from '../shared/service/periodo.academico.service';
import { EliminarHorarioProgramaComponent } from './planificacion-horario/eliminar-horario-programa/eliminar-horario-programa.component';
import { CursoService } from './servicios/curso.service';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ResultadoGeneracionHorarioComponent } from './planificacion-horario/planificacion-semestre-anterior/resultado-generacion-horario/resultado-generacion-horario.component';
import { DocenteService } from './servicios/docente.service';
import { UsuarioService } from './servicios/usuario.service';
import { CrearEditardocenteComponent } from './datos/gestionar-docente/crear-editar-docente/crear-editar-docente.component';
import { AsignaturaService } from './servicios/asignatura.service';
import { EspacioFisicoService } from './servicios/espacio.fisico.service';
import { FacultadService } from './servicios/facultad.service';


@NgModule({
	declarations: [
		GestionarCursoComponent,
		GestionarDocenteComponent,
		GestionarEspacioFisicoComponent,
		AsociarEspacioFisicoComponent,
		AsociarDocenteComponent,
		CrearEditarVerCursoComponent,
		InicioComponent,
		GestionarGrupoComponent,
		CargarLaborDocenciaComponent,
		PlanificacionManualComponent,
		PlanificacionSemestreAnteriorComponent,
		PlanificacionSemestreAnteriorComponent,
		GenerarReporteSimcaComponent,
		GestionarReservaTemporalComponent,
		GestionarReservaFacultadComponent,
		GestionarUsuarioComponent,
		HorarioDocenteComponent,
		BandejaReporteDocenteComponent,

		HorarioEspacioFisicoComponent,
		BandejaReporteEspacioFisicoComponent,
		CrearEditarVerUsuarioComponent,
  		CrearEditarEspacioFisicoComponent,
        EliminarHorarioProgramaComponent,
        ResultadoGeneracionHorarioComponent,
		CrearEditardocenteComponent
	],
	imports: [
		ReactiveFormsModule,
		CommonModule,
		PrimeNgModule,
		SharedModule,
		MessageModule,
		ToastModule,
		
	],
	providers: [EspacioFisicoService, 
		ProgramaService, 
		FacultadService, 
		SharedService, 
		PeriodoAcademicoService,
		CursoService,
		AsignaturaService,
		DocenteService,
		UsuarioService
	]
})
export class ComponentesModule { }
