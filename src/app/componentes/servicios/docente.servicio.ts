import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocenteOutDTO } from '../dto/docente/out/docente.out.dto';
import { FiltroDocenteDTO } from '../dto/docente/in/filtro.docente.dto';

@Injectable()
export class DocenteServicio{

    constructor(private http: HttpClient) {
    }

   

    /**
	 * Método encargado de obtener los docentes dado un conjunto de criterios de
	 * busqueda.
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param filtroDocenteDTO
	 * @return
	 */
    public consultarDocentes(filtroDocenteDTO:FiltroDocenteDTO): Observable<any>{
        return this.http.post<any>("http://localhost:8081/AdministrarDocente/consultarDocentes",filtroDocenteDTO);
    }  

     /**
	 * Método encargado de obtener los docentes asociados a un curso
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param idCurso
	 * @return
	 */
    public consultarDocentePorIdCurso(idCurso:number): Observable<DocenteOutDTO[]>{
        const url = `http://localhost:8081/AdministrarDocente/consultarDocentePorIdCurso?idCurso=${idCurso}`;
        return this.http.get<any>(url);
    } 
}