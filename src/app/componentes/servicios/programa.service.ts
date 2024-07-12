import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProgramaOutDTO } from '../dto/programa/out/programa.out.dto';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProgramaService{

	urlAdministrarPrograma: string = "AdministrarPrograma"

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
	public consultarProgramasPorIdFacultad(lstIdFacultad: number[]): Observable<ProgramaOutDTO[]> {
		const params = new HttpParams().set('lstIdFacultad', lstIdFacultad.join(','));
		const url = `${environment.url}${this.urlAdministrarPrograma}/consultarProgramasPorIdFacultad`;
		return this.http.get<ProgramaOutDTO[]>(url, { params });
	}

	/**
	 * Método encargado de consultar todos los programas
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @return
	 */
	public consultarProgramas(): Observable<ProgramaOutDTO[]> {
		const url = `${environment.url}${this.urlAdministrarPrograma}/consultarProgramas`;
		return this.http.get<ProgramaOutDTO[]>(url);
	}
}