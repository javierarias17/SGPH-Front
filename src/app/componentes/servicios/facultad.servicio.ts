import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FacultadOutDTO } from '../dto/facultad/out/facultad.out.dto';

@Injectable()
export class FacultadServicio{

    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de consultar todas las facultades </br>
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @return
	 */
    public consultarFacultades(): Observable<FacultadOutDTO[]>{
        const url = `http://localhost:8081/AdministrarFacultad/consultarFacultades`;
        return this.http.get<FacultadOutDTO[]>(url);
    }  
}