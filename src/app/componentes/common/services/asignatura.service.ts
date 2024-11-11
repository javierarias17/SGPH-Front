import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroBase } from '../model/filtro-base';
import { FiltroAsignaturasDTO } from '../../datos/gestionar-asignatura/model/filtro-asignaturas';
import { AsignaturaOutDTO } from '../../datos/gestionar-asignatura/model/asignatura-dto';

@Injectable()
export class AsignaturaService{

    urlAsignatura: string = "AdministrarAsignatura"
    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de obtener las materias de un programa
	 * 
	 * @author apedro
	 * 
	 * @param idPrograma
	 * @return
	 */
    public consultarAsignaturasActivasPorIdPrograma(idPrograma:number): Observable<any>{
        let params = new HttpParams().set('idPrograma', idPrograma);
        const url = `${environment.url}${this.urlAsignatura}/consultarAsignaturasActivasPorIdPrograma`;
        return this.http.get<any>(url, {params: params});
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
    public inactivarAsignatura(id: number): Observable <any> {
        const url = `${environment.url}${this.urlAsignatura}/inactivarAsignaturaPorId/${id}`;
        return this.http.get<any>(url);   
    }
    public cargaMasiva(save: any): Observable <any> {
        const url = `${environment.url}${this.urlAsignatura}/cargaMasiva`;
        return this.http.post<any>(url, save);   
    }
}