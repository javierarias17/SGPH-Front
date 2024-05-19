import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';


@Injectable()
export class PeriodoAcademicoServicio{

    urlAsignatura: string = "AdministrarPeriodoAcademico"
    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de consultar el periodo académico vigente<br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return
	 */
    public consultarAsignaturasPorIdPrograma(): Observable<any>{
        const url = `http://localhost:8081/AdministrarPeriodoAcademico/consultarPeriodoAcademicoVigente`;
        return this.http.get<any>(url);
    }
}