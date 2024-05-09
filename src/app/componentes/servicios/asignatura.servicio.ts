import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AsignaturaOutDTO } from '../datos/gestionar-asignatura/model/asignatura-dto';
import { environment } from 'src/environments/environment';
import { FiltroBase } from '../dto/filtro-base';
import { FiltroAsignaturasDTO } from '../datos/gestionar-asignatura/model/filtro-asignaturas';

@Injectable()
export class AsignaturaServicio{

    urlAsignatura: string = "AdministrarAsignatura"
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

    public consultarAsignaturaPorId(idAsignatura:number): Observable<AsignaturaOutDTO>{
        let params = new HttpParams().set('idAsignatura', idAsignatura);
        const url = `${environment.url}${this.urlAsignatura}/consultarAsignaturaPorId`;
        return this.http.get<any>(url, {params: params});
    }
    public filtrarAsignaturas(filtro:FiltroBase): Observable<FiltroAsignaturasDTO>{
        const url = `${environment.url}${this.urlAsignatura}/filtrarAsignaturas`;
        return this.http.post<any>(url, filtro);
    }
    public guardarAsignatura(save: AsignaturaOutDTO): Observable <AsignaturaOutDTO> {
        const url = `${environment.url}${this.urlAsignatura}/guardarAsignatura`;
        return this.http.post<any>(url, save);   
    }
}