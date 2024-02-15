import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EdificioOutDTO } from '../dto/edificio/out/edificio.out.dto';

@Injectable()
export class EdificioServicio{

    constructor(private http: HttpClient) {
    }

   /**
	 * Método encargado de consultar los edificios asociados a una lista de
	 * facultades </br>
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @param lstIdFacultad
	 * @return
	 */
    public consultarEdificiosPorIdFacultad(lstIdFacultad:number[]): Observable<EdificioOutDTO[]>{
        const url = `http://localhost:8081/AdministrarEdificio/consultarEdificiosPorIdFacultad?lstIdFacultad=${lstIdFacultad.join(',')}`;
        return this.http.get<EdificioOutDTO[]>(url);
    }  
}