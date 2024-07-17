import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoGeneralCursosPorProgramaDTO } from '../dto/curso/out/info.general.cursos.por.programa.dto';
import { FiltroCursoPlanificacionDTO } from '../dto/curso/in/filtro.curso.planificacion.dto';
import { CrearActualizarHorarioCursoInDTO } from '../dto/horario/in/crea.actualizar.horario.curso.in.dto';
import { CrearActualizarDocentesCursoInDTO } from '../dto/horario/in/crea.actualizar.docentes.curso.in.dto';
import { CrearActualizarHorarioCursoOutDTO } from '../dto/horario/out/crea.actualizar.horario.curso.out.dto';
import { CrearActualizarDocentesCursoOutDTO } from '../dto/horario/out/crea.actualizar.docentes.curso.out.dto';
import { FranjaHorariaCursoDTO } from '../dto/curso/out/franja.horaria.curso.dto';
import { FiltroFranjaHorariaDisponibleCursoDTO } from '../dto/horario/in/filtro.franja.horaria.disponible.curso.dto';
import { FranjaHorariaDocenteDTO } from '../dto/docente/out/franja.horaria.docente.dto';
import { FranjaHorariaEspacioFisicoDTO } from '../dto/espacio-fisico/out/franja.horaria.espacio.fisico.dto';
import { FormatoPresentacionFranjaHorariaCursoDTO } from '../dto/espacio-fisico/out/formato.presentacion.franja.horaria.curso.dto';
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
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param filtroCursoPlanificacionDTO
	 * @return
	 */
    public consultarCursosPlanificacionPorFiltro(filtroCursoPlanificacionDTO:FiltroCursoPlanificacionDTO): Observable<any>{
		const url = `${environment.url}${this.urlPlanificacionManual}/consultarCursosPlanificacionPorFiltro`;
        return this.http.post<any>(url, filtroCursoPlanificacionDTO);  
    }  

	/**
 	 * Método encargado de consultar la información gneral de los cursos de un
	 * programa dado el identificador del programa
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
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
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @param filtroFranjaHorariaDisponibleCursoDTO
	 * @return
	 */
	public consultarFranjasHorariasDisponiblesPorCurso(filtroFranjaHorariaDisponibleCursoDTO: FiltroFranjaHorariaDisponibleCursoDTO): Observable<FranjaHorariaCursoDTO[]> {
		const url = `${environment.url}${this.urlPlanificacionManual}/consultarFranjasHorariasDisponiblesPorCurso`;
		return this.http.post<FranjaHorariaCursoDTO[]>(url, filtroFranjaHorariaDisponibleCursoDTO);
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
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
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
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
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
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
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
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
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
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @param eliminarHorarioInDTO Información necesaria para eliminar el horario de
	 *                           un programa
	 * @return Booleano que indica si se eliminó con exito el horario
	 */
	public eliminarHorarioPrograma(eliminarHorarioInDTO: any): Observable<Boolean> {
		const url = `${environment.url}${this.urlPlanificacionManual}/eliminarHorarioPrograma`;
		return this.http.post<Boolean>(url, eliminarHorarioInDTO);
	}

	/**
	 * Método encargado de generar un horario base para un programa partiendo del
	 * horario del semestre anterior del mismo</br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
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