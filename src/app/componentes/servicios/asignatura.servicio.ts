import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class AsignaturaServicio{

    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de obtener las materias de un programa
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param idPrograma
	 * @return
	 */
    public consultarAsignaturasPorIdPrograma(idPrograma:number): Observable<any>{
        const url = `http://localhost:8081/AdministrarAsignatura/consultarAsignaturasPorIdPrograma?idPrograma=${idPrograma}`;
        return this.http.get<any>(url);
    }  
}