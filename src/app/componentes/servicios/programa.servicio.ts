import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProgramaOutDTO } from '../dto/programa/out/programa.out.dto';

@Injectable()
export class ProgramaServicio{

    constructor(private http: HttpClient) {
    }

   /**
	 * Método encargado de consultar los programas asociados a una lista de
	 * facultades
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @param lstIdFacultad
	 * @return
	 */
    public consultarProgramasPorIdFacultad(lstIdFacultad:number[]): Observable<ProgramaOutDTO[]>{
        const url = `http://localhost:8081/AdministrarPrograma/consultarProgramasPorIdFacultad?lstIdFacultad=${lstIdFacultad.join(',')}`;
        return this.http.get<ProgramaOutDTO[]>(url);
    }  

	/**
	 * Método encargado de consultar todos los programas
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @return
	 */
    public consultarProgramas(): Observable<ProgramaOutDTO[]>{
        const url = `http://localhost:8081/AdministrarPrograma/consultarProgramas`;
        return this.http.get<ProgramaOutDTO[]>(url);
    }  
}