import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoGeneralCursosPorProgramaDTO } from '../../datos/gestionar-curso/model/out/info.general.cursos.por.programa.dto';
import { FiltroCursoPlanificacionDTO } from '../../datos/gestionar-curso/model/in/filtro.curso.planificacion.dto';
import { CrearActualizarHorarioCursoInDTO } from '../model/horario/in/crea.actualizar.horario.curso.in.dto';
import { CrearActualizarDocentesCursoInDTO } from '../model/horario/in/crea.actualizar.docentes.curso.in.dto';
import { CrearActualizarHorarioCursoOutDTO } from '../model/horario/out/crea.actualizar.horario.curso.out.dto';
import { CrearActualizarDocentesCursoOutDTO } from '../model/horario/out/crea.actualizar.docentes.curso.out.dto';
import { FranjaHorariaCursoDTO } from '../../datos/gestionar-curso/model/out/franja.horaria.curso.dto';
import { FiltroFranjaHorariaDisponibleCursoDTO } from '../model/horario/in/filtro.franja.horaria.disponible.curso.dto';
import { FranjaHorariaDocenteDTO } from '../../datos/gestionar-docente/model/out/franja.horaria.docente.dto';
import { FranjaHorariaEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/out/franja.horaria.espacio.fisico.dto';
import { FormatoPresentacionFranjaHorariaCursoDTO } from '../../datos/gestionar-espacio-fisico/model/out/formato.presentacion.franja.horaria.curso.dto';
import { environment } from 'src/environments/environment';

@Injectable()
export class PlanificacionManualService{

    urlPlanificacionManual: string = "PlanificacionManual"

    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de obtener los cursos dado un conjunto de criterios de
	 * busqueda.
	 * 
	 * @author apedro
	 * 
	 * @param filtroCursoPlanificacionDTO
	 * @return
	 */
    public consultarCursosPlanificacionPorFiltro(filtroCursoPlanificacionDTO:FiltroCursoPlanificacionDTO): Observable<any>{
		const url = `${environment.url}${this.urlPlanificacionManual}/consultarCursosPlanificacionPorFiltro`;

		let params = new HttpParams();
	
		if (filtroCursoPlanificacionDTO.estadoCursoHorario) {
			params = params.set('estadoCursoHorario', filtroCursoPlanificacionDTO.estadoCursoHorario.toString());
		}
		if (filtroCursoPlanificacionDTO.listaIdFacultad && filtroCursoPlanificacionDTO.listaIdFacultad.length > 0) {
			params = params.set('listaIdFacultad', filtroCursoPlanificacionDTO.listaIdFacultad.join(','));
		}
		if (filtroCursoPlanificacionDTO.listaIdPrograma && filtroCursoPlanificacionDTO.listaIdPrograma.length > 0) {
			params = params.set('listaIdPrograma', filtroCursoPlanificacionDTO.listaIdPrograma.join(','));
		}
		if (filtroCursoPlanificacionDTO.listaIdAsignatura && filtroCursoPlanificacionDTO.listaIdAsignatura.length > 0) {
			params = params.set('listaIdAsignatura', filtroCursoPlanificacionDTO.listaIdAsignatura.join(','));
		}
		if (filtroCursoPlanificacionDTO.semestre) {
			params = params.set('semestre', filtroCursoPlanificacionDTO.semestre.toString());
		}
		params = params.set('pagina', filtroCursoPlanificacionDTO.pagina?.toString() || '0');
		params = params.set('registrosPorPagina', filtroCursoPlanificacionDTO.registrosPorPagina?.toString() || '10');
		if (filtroCursoPlanificacionDTO.cantidadDocentes) {
			params = params.set('cantidadDocentes', filtroCursoPlanificacionDTO.cantidadDocentes.toString());
		}
	
		return this.http.get<any>(url, { params }); 
    }  

	/**
 	 * Método encargado de consultar la información gneral de los cursos de un
	 * programa dado el identificador del programa
	 * 
	 * @author apedro
	 * 
	 * @param idPrograma Identificador del programa
	 * @return
	 */
	 public consultarInfoGeneralCursosPorPrograma(idPrograma:number): Observable<InfoGeneralCursosPorProgramaDTO>{
		let params = new HttpParams().set('idPrograma', idPrograma);
        const url = `${environment.url}${this.urlPlanificacionManual}/consultarInfoGeneralCursosPorPrograma`;
        return this.http.get<InfoGeneralCursosPorProgramaDTO>(url,{params});
    } 

	public crearActualizarHorarioCursoDTO(crearActualizarHorarioCursoInDTO:CrearActualizarHorarioCursoInDTO): Observable<CrearActualizarHorarioCursoOutDTO>{
		const url = `${environment.url}${this.urlPlanificacionManual}/crearActualizarHorarioCursoDTO`;
        return this.http.post<any>(url, crearActualizarHorarioCursoInDTO);  
	}

	public crearActualizarHorarioSecundarioCurso(crearActualizarHorarioCursoInDTO: CrearActualizarHorarioCursoInDTO): Observable<CrearActualizarHorarioCursoOutDTO> {
		const url = `${environment.url}${this.urlPlanificacionManual}/crearActualizarHorarioSecundarioCurso`;
		return this.http.post<any>(url, crearActualizarHorarioCursoInDTO);  
	}

	public crearActualizarDocentesCursoDTO(crearActualizarDocentesCursoInDTO: CrearActualizarDocentesCursoInDTO): Observable<CrearActualizarDocentesCursoOutDTO> {
		const url = `${environment.url}${this.urlPlanificacionManual}/crearActualizarDocentesCursoDTO`;
		return this.http.post<any>(url, crearActualizarDocentesCursoInDTO);
	}

	/**
	 * Método encargado de obtener las franjas disponibles de un curso dado un
	 * conjunto de criterios de busqueda; este método considera los horarios de los
	 * docentes y espacios físicos.
	 * 
	 * @author apedro
	 * 
	 * @param filtroFranjaHorariaDisponibleCursoDTO
	 * @return
	 */
	public consultarFranjasHorariasDisponiblesPorCurso(filtroFranjaHorariaDisponibleCursoDTO: FiltroFranjaHorariaDisponibleCursoDTO): Observable<FranjaHorariaCursoDTO[]> {
	    const url = `${environment.url}${this.urlPlanificacionManual}/consultarFranjasHorariasDisponiblesPorCurso`;

		// Crear los parámetros de URL a partir del objeto filtroFranjaHorariaDisponibleCursoDTO
		let params = new HttpParams();

		if (filtroFranjaHorariaDisponibleCursoDTO.idCurso) {
			params = params.set('idCurso', filtroFranjaHorariaDisponibleCursoDTO.idCurso.toString());
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.idAsignatura) {
			params = params.set('idAsignatura', filtroFranjaHorariaDisponibleCursoDTO.idAsignatura.toString());
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.horaInicio) {
			params = params.set('horaInicio', filtroFranjaHorariaDisponibleCursoDTO.horaInicio);
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.horaFin) {
			params = params.set('horaFin', filtroFranjaHorariaDisponibleCursoDTO.horaFin);
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.duracion) {
			params = params.set('duracion', filtroFranjaHorariaDisponibleCursoDTO.duracion.toString());
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion && filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion.length > 0) {
			params = params.set('listaIdUbicacion', filtroFranjaHorariaDisponibleCursoDTO.listaIdUbicacion.join(','));
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.listaDiaSemanaEnum && filtroFranjaHorariaDisponibleCursoDTO.listaDiaSemanaEnum.length > 0) {
			params = params.set('listaDiaSemanaEnum', filtroFranjaHorariaDisponibleCursoDTO.listaDiaSemanaEnum.join(','));
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico && filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico.length > 0) {
			params = params.set('listaIdAgrupadorEspacioFisico', filtroFranjaHorariaDisponibleCursoDTO.listaIdAgrupadorEspacioFisico.join(','));
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoEspacioFisico && filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoEspacioFisico.length > 0) {
			params = params.set('listaIdTipoEspacioFisico', filtroFranjaHorariaDisponibleCursoDTO.listaIdTipoEspacioFisico.join(','));
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.salon) {
			params = params.set('salon', filtroFranjaHorariaDisponibleCursoDTO.salon);
		}
		if (filtroFranjaHorariaDisponibleCursoDTO.esPrincipal !== undefined) {
			params = params.set('esPrincipal', filtroFranjaHorariaDisponibleCursoDTO.esPrincipal.toString());
		}

		// Realizar la solicitud GET con los parámetros
		return this.http.get<FranjaHorariaCursoDTO[]>(url, { params });
	}

	/**
	 * 
	 * Método encargado de obtener los nombres completos de cada espacio físico.
	 * Necesario para la funcionalidad de asociar espacios físicos (Asignar los
	 * horarios al curso) de la pantalla Planificación Manual. Este servicio es útil
	 * para mapear los nombres de los espacios físicos mediante su identificador
	 * único. 
	 * 
	 * Nota: Actualmente como se encuentra los datos de espacios físicos sólo se
	 * está obteniendo el identificador único del espacio físico y el salon (Incluye
	 * el formato que se necesario, ya no es necesrio armarlo)
	 * 
	 * @author apedro
	 * 
	 * @return
	 */	
	public consultarFormatoPresentacionFranjaHorariaCurso(): Observable<FormatoPresentacionFranjaHorariaCursoDTO[]> {
		const url = `${environment.url}${this.urlPlanificacionManual}/consultarFormatoPresentacionFranjaHorariaCurso`;
		return this.http.get<FormatoPresentacionFranjaHorariaCursoDTO[]>(url);
	}
	
	/**
	 * Método encargado de obtener los espacios físicos asociadas a un curso.
	 * 
	 * @author apedro
	 * 
	 * @param idCurso
	 * @return
	 */
	public consultarFranjasHorariaCursoPorIdCurso(idCurso: number, esPrincipal: boolean): Observable<FranjaHorariaCursoDTO[]> {
		let params = new HttpParams()
		  .set('idCurso', idCurso.toString())
		  .set('esPrincipal', esPrincipal.toString());
	
		const url = `${environment.url}${this.urlPlanificacionManual}/consultarFranjasHorariaCursoPorIdCurso`;
		return this.http.get<FranjaHorariaCursoDTO[]>(url, { params });
	}
	

	 /**
	 * Método encargado de obtener todas las franjas horarias de un docente
	 * 
	 * @author apedro
	 * 
	 * @param idPersona
	 * @return
	 */
	public consultarFranjasDocentePorIdPersona(idPersona: number): Observable<FranjaHorariaDocenteDTO[]> {
		let params = new HttpParams().set('idPersona', idPersona.toString());
		const url = `${environment.url}${this.urlPlanificacionManual}/consultarFranjasDocentePorIdPersona`;
		return this.http.get<FranjaHorariaDocenteDTO[]>(url, { params });
	} 

	/**
	 * Método encargado de obtener todas las franjas horarias de un espacio físico
	 *
	 * @author apedro
	 * 
	 * @param idEspacioFisico
	 * @return
	 */
	public consultarFranjasEspacioFisicoPorIdEspacioFisico(idEspacioFisico: number): Observable<FranjaHorariaEspacioFisicoDTO[]> {
		let params = new HttpParams().set('idEspacioFisico', idEspacioFisico.toString());
		const url = `${environment.url}${this.urlPlanificacionManual}/consultarFranjasEspacioFisicoPorIdEspacioFisico`;
		return this.http.get<FranjaHorariaEspacioFisicoDTO[]>(url, { params });
	  }

	/**
	 * Método encargado de eliminar todo el horario de un programa
	 * 
	 * @author apedro
	 * 
	 * @param eliminarHorarioInDTO Información necesaria para eliminar el horario de
	 *                           un programa
	 * @return Booleano que indica si se eliminó con exito el horario
	 */
	public eliminarHorarioPrograma(eliminarHorarioInDTO: any): Observable<Boolean> {
		const url = `${environment.url}${this.urlPlanificacionManual}/eliminarHorarioPrograma`;    
		const params = new HttpParams().set('idPrograma', eliminarHorarioInDTO.idPrograma.toString());
		return this.http.delete<Boolean>(url, { params });
	}

	/**
	 * Método encargado de generar un horario base para un programa partiendo del
	 * horario del semestre anterior del mismo</br>
	 * 
	 * @author apedro
	 * 
	 * @param generarHorarioBaseInDTO Información requerida para generar el horario
	 *                                base
	 * @return
	 */
	public generarHorarioBasadoEnSemestreAnteriorPorPrograma(generarHorarioBaseInDTO: any): Observable<any> {
		const url = `${environment.url}${this.urlPlanificacionManual}/generarHorarioBasadoEnSemestreAnteriorPorPrograma`;
		return this.http.post<any>(url, generarHorarioBaseInDTO);
	}
}