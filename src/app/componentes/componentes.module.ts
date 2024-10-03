import { NgModule } from '@angular/core';
import { GestionarCursoComponent } from './datos/gestionar-curso/pages/gestionar.curso.component';
import { GestionarEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/pages/gestionar.espacio.fisico.component';
import { GestionarDocenteComponent } from './datos/gestionar-docente/pages/gestionar.docente.component';

import { InicioComponent } from './home/pages/inicio.component';

import { PlanificacionManualComponent } from './planificacion-horario/planificacion-manual/pages/planificacion.manual.component';
import { PlanificacionSemestreAnteriorComponent } from './planificacion-horario/planificacion-semestre-anterior/pages/planificacion.semestre.anterior.component';
import { GenerarReporteSimcaComponent } from './reportes/generar-reporte-simca/pages/generar.reporte.simca.component';
import { GestionarReservaTemporalComponent } from './reservas/gestionar-reserva-temporal/gestionar.reserva.temporal.component';
import { GestionarUsuarioComponent } from './seguridad/gestionar-usuario/pages/gestionar.usuario.component';
import { AsociarDocenteComponent } from './planificacion-horario/planificacion-manual/components/asociar-docente/asociar.docente.component';

import { HorarioEspacioFisicoComponent } from './reportes/reporte-espacio-fisico/horario-espacio-fisico/horario.espacio.fisico.component';
import { CrearEditarVerUsuarioComponent } from './seguridad/gestionar-usuario/components/crear-editar-ver-usuario/crear.editar.ver.usuario.component';
import { AsociarEspacioFisicoComponent } from './planificacion-horario/planificacion-manual/components/asociar-espacio-fisico/asociar.espacio.fisico.component';
import { CargarLaborDocenciaComponent } from './datos/cargar-labor-docencia/pages/cargar.labor.docencia.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CrearEditarEspacioFisicoComponent } from './datos/gestionar-espacio-fisico/components/crear-editar-espacio-fisico/crear-editar-espacio-fisico.component';
import { HorarioDocenteComponent } from './reportes/reporte-docente/horario-docente/horario.docente.component';
import { BandejaReporteDocenteComponent } from './reportes/reporte-docente/pages/bandeja-reporte-docente.component';
import { BandejaReporteEspacioFisicoComponent } from './reportes/reporte-espacio-fisico/pages/bandeja-reporte-espacio-fisico.component';
import { ProgramaService } from './common/services/programa.service';
import { SharedService } from '../shared/service/shared.service';
import { PeriodoAcademicoService } from '../shared/service/periodo.academico.service';
import { EliminarHorarioProgramaComponent } from './planificacion-horario/eliminar-horario-programa/pages/eliminar-horario-programa.component';
import { CursoService } from './common/services/curso.service';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ResultadoGeneracionHorarioComponent } from './planificacion-horario/planificacion-semestre-anterior/components/resultado-generacion-horario/resultado-generacion-horario.component';
import { DocenteService } from './common/services/docente.service';
import { UsuarioService } from './common/services/usuario.service';
import { CrearEditardocenteComponent } from './datos/gestionar-docente/components/crear-editar-docente/crear-editar-docente.component';
import { AsignaturaService } from './common/services/asignatura.service';
import { EspacioFisicoService } from './common/services/espacio.fisico.service';
import { FacultadService } from './common/services/facultad.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GenerarReporteDocenteComponent } from './reportes/generar-reporte-docente/pages/generar.reporte.docente.component';
import { GestionarPersonaComponent } from './datos/gestionar-persona/pages/gestionar.persona.component';
import { CardModule } from 'primeng/card';
import { CrearEditarVerCursoComponent } from './datos/gestionar-curso/components/crear-editar-consultar-curso/crear.editar.ver.curso.component';
 

@NgModule({
	declarations: [
		GestionarCursoComponent,
		GestionarDocenteComponent,
		GestionarEspacioFisicoComponent,
		AsociarEspacioFisicoComponent,
		AsociarDocenteComponent,
		CrearEditarVerCursoComponent,
		InicioComponent,
		GestionarPersonaComponent,
		CargarLaborDocenciaComponent,
		PlanificacionManualComponent,
		PlanificacionSemestreAnteriorComponent,
		PlanificacionSemestreAnteriorComponent,
		GenerarReporteSimcaComponent,
		GestionarReservaTemporalComponent,
		GestionarUsuarioComponent,
		HorarioDocenteComponent,
		BandejaReporteDocenteComponent,

		HorarioEspacioFisicoComponent,
		BandejaReporteEspacioFisicoComponent,
		CrearEditarVerUsuarioComponent,
  		CrearEditarEspacioFisicoComponent,
        EliminarHorarioProgramaComponent,
        ResultadoGeneracionHorarioComponent,
		CrearEditardocenteComponent,
		GenerarReporteDocenteComponent
	],
	imports: [
		CardModule,
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
		UsuarioService,
		DynamicDialogRef,
		DynamicDialogConfig
	]
})
export class ComponentesModule { }
