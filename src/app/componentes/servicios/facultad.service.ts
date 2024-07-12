import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FacultadOutDTO } from '../dto/facultad/out/facultad.out.dto';
import { environment } from 'src/environments/environment';

@Injectable()
export class FacultadService{

    urlAdministrarFacultad: string = "AdministrarFacultad";

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
        const url = `${environment.url}${this.urlAdministrarFacultad}/consultarFacultades`;
        return this.http.get<FacultadOutDTO[]>(url);
    }  
}