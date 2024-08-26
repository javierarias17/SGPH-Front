import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocenteOutDTO } from '../dto/docente/out/docente.out.dto';
import { FiltroDocenteDTO } from '../dto/docente/in/filtro.docente.dto';
import { environment } from 'src/environments/environment';

@Injectable()
export class DocenteService{
    urlDocente: string = "AdministrarDocente"
    constructor(private http: HttpClient) {
    }  

    /**
	 * Método encargado de obtener los docentes dado un conjunto de criterios de
	 * busqueda.
	 * 
	 * @author apedro
	 * 
	 * @param filtroDocenteDTO
	 * @return
	 */ 
	public consultarDocentes(filtroDocenteDTO: FiltroDocenteDTO): Observable<any> {
		const url = `${environment.url}${this.urlDocente}/consultarDocentes`;
		return this.http.post<any>(url, filtroDocenteDTO);
	}   

     /**
	 * Método encargado de obtener los docentes asociados a un curso
	 * 
	 * @author apedro
	 * 
	 * @param idCurso
	 * @return
	 */
	public consultarDocentePorIdCurso(idCurso: number): Observable<DocenteOutDTO[]> {
		const params = new HttpParams().set('idCurso', idCurso.toString());
		const url = `${environment.url}${this.urlDocente}/consultarDocentePorIdCurso`;
		return this.http.get<DocenteOutDTO[]>(url, { params });
	}

	public consultarDocentePorIdentificacion(idTipoIdentificacion: number, numeroIdentificacion: string): Observable<DocenteOutDTO> {
		const params = new HttpParams()
		  .set('idTipoIdentificacion', idTipoIdentificacion.toString())
		  .set('numeroIdentificacion', numeroIdentificacion);
		  const url = `${environment.url}${this.urlDocente}/consultarDocentePorIdentificacion`;
		return this.http.get<DocenteOutDTO>(url, { params });
	}

    public guardarDocente(save: DocenteOutDTO): Observable <DocenteOutDTO> {
        const url = `${environment.url}${this.urlDocente}/guardarDocente`;
        return this.http.post<any>(url, save);   
    }
}