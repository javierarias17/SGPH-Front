import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocenteOutDTO } from '../../datos/gestionar-docente/model/out/docente.out.dto';
import { FiltroDocenteDTO } from '../../datos/gestionar-docente/model/in/filtro.docente.dto';
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

		// Crear los parámetros de URL a partir del objeto filtroDocenteDTO
		let params = new HttpParams();

		if (filtroDocenteDTO.nombre) {
			params = params.set('nombre', filtroDocenteDTO.nombre);
		}
		if (filtroDocenteDTO.numeroIdentificacion) {
			params = params.set('numeroIdentificacion', filtroDocenteDTO.numeroIdentificacion);
		}
		if (filtroDocenteDTO.codigo) {
			params = params.set('codigo', filtroDocenteDTO.codigo);
		}
		if (filtroDocenteDTO.estado) {
			params = params.set('estado', filtroDocenteDTO.estado.toString());
		}
		if(filtroDocenteDTO.pagina || filtroDocenteDTO.pagina===0){
			params = params.set('pagina', filtroDocenteDTO.pagina.toString());
		}
		if(filtroDocenteDTO.registrosPorPagina){
			params = params.set('registrosPorPagina', filtroDocenteDTO.registrosPorPagina.toString());
		}

		// Realizar la solicitud GET con los parámetros
		return this.http.get<any>(url, { params });
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