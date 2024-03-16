import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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

@Injectable()
export class PlanificacionManualServicio{

    
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
        return this.http.post<any>("http://localhost:8081/PlanificacionManual/consultarCursosPlanificacionPorFiltro",filtroCursoPlanificacionDTO);
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
        const url = `http://localhost:8081/PlanificacionManual/consultarInfoGeneralCursosPorPrograma?idPrograma=${idPrograma}`;
        return this.http.get<InfoGeneralCursosPorProgramaDTO>(url);
    } 

	public crearActualizarHorarioCursoDTO(crearActualizarHorarioCursoInDTO:CrearActualizarHorarioCursoInDTO): Observable<CrearActualizarHorarioCursoOutDTO>{
		return this.http.post<any>("http://localhost:8081/PlanificacionManual/crearActualizarHorarioCursoDTO",crearActualizarHorarioCursoInDTO);
	}

	public crearActualizarDocentesCursoDTO(crearActualizarDocentesCursoInDTO:CrearActualizarDocentesCursoInDTO): Observable<CrearActualizarDocentesCursoOutDTO>{
		return this.http.post<any>("http://localhost:8081/PlanificacionManual/crearActualizarDocentesCursoDTO",crearActualizarDocentesCursoInDTO);
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
    public consultarFranjasHorariasDisponiblesPorCurso(filtroFranjaHorariaDisponibleCursoDTO:FiltroFranjaHorariaDisponibleCursoDTO): Observable<FranjaHorariaCursoDTO[]>{
		return this.http.post<FranjaHorariaCursoDTO[]>("http://localhost:8081/PlanificacionManual/consultarFranjasHorariasDisponiblesPorCurso",filtroFranjaHorariaDisponibleCursoDTO);
    }  

	/**
	 * Método encargado de obtener los nombres completos de cada espacio físico.
	 * Ejemplo del formato: 'Salón 204-Edificio nuevo' 
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @return
	 */
    public consultarFormatoPresentacionFranjaHorariaCurso(): Observable<FormatoPresentacionFranjaHorariaCursoDTO[]>{
        const url = `http://localhost:8081/PlanificacionManual/consultarFormatoPresentacionFranjaHorariaCurso`;
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
	  public consultarFranjasHorariaCursoPorIdCurso(idCurso:number): Observable<FranjaHorariaCursoDTO[]>{
        const url = `http://localhost:8081/PlanificacionManual/consultarFranjasHorariaCursoPorIdCurso?idCurso=${idCurso}`;
        return this.http.get<FranjaHorariaCursoDTO[]>(url);
    }
	

	 /**
	 * Método encargado de obtener todas las franjas horarias de un docente
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @param idPersona
	 * @return
	 */
	 public consultarFranjasDocentePorIdPersona(idPersona:number): Observable<FranjaHorariaDocenteDTO[]>{
        const url = `http://localhost:8081/PlanificacionManual/consultarFranjasDocentePorIdPersona?idPersona=${idPersona}`;
        return this.http.get<FranjaHorariaDocenteDTO[]>(url);
    }  

	/**
	 * Método encargado de obtener todas las franjas horarias de un espacio físico
	 *
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @param idEspacioFisico
	 * @return
	 */
    public consultarFranjasEspacioFisicoPorIdEspacioFisico(idEspacioFisico:number): Observable<FranjaHorariaEspacioFisicoDTO[]>{
        const url = `http://localhost:8081/PlanificacionManual/consultarFranjasEspacioFisicoPorIdEspacioFisico?idEspacioFisico=${idEspacioFisico}`;
        return this.http.get<FranjaHorariaEspacioFisicoDTO[]>(url);
    }  
}