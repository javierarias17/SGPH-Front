import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { InfoGeneralCursosPorProgramaDTO } from '../dto/curso/out/info.general.cursos.por.programa.dto';
import { FiltroCursoPlanificacionDTO } from '../dto/curso/in/filtro.curso.planificacion.dto';

@Injectable()
export class CursoServicio{

    
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
}