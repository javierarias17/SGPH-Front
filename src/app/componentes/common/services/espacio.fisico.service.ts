import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/in/filtro.espacio.fisico.dto';
import { TipoEspacioFisicoOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/espacio.fisico.out.dto';
import { AgrupadorEspacioFisicoOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/agrupador.espacio.fisico.out.dto';
import { UbicacionOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { EspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/out/espacio.fisico.dto';
import { EdificioOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/edificio.out.dto';
import { environment } from 'src/environments/environment';



@Injectable()
export class EspacioFisicoService {

	urlAdministrarEspacioFisico: string = "AdministrarEspacioFisico";
	urlAdministrarAgrupador: string = "AdministrarAgrupador";

	constructor(private http: HttpClient) {
    }

    //Servicio utilizado en la pantalla de Gestionar espacios físicos
	public consultarEspacioFisicoPorIdEspacioFisico(idEspacioFisico: number): Observable<EspacioFisicoOutDTO> {
	const params = new HttpParams().set('idEspacioFisico', idEspacioFisico.toString());
	const url = `${environment.url}${this.urlAdministrarEspacioFisico}/consultarEspacioFisicoPorIdEspacioFisico`;
	return this.http.get<EspacioFisicoOutDTO>(url, { params });
	}

    /**
	 * Método encargado de consultar los tipos de espacios físicos por ubicaciones
	 * 
	 * @author apedro
	 * 
	 * @param lstIdUbicacion
	 * @return
	 */  
	public consultarTiposEspaciosFisicosPorUbicaciones(lstIdUbicacion: number[]): Observable<TipoEspacioFisicoOutDTO[]> {
		const params = new HttpParams().set('lstIdUbicacion', lstIdUbicacion.join(','));
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/consultarTiposEspaciosFisicosPorUbicaciones`;
		return this.http.get<TipoEspacioFisicoOutDTO[]>(url, { params });
	}  

	/**
	 *  Método encargado de consultar los espacios físicos por diferentes criterios
	 * de busqueda y retornarlos de manera paginada
	 * 
	 * @author apedro
	 * 
	 * @param filtroEspacioFisicoDTO
	 * @return
	 */ 
	public consultarEspaciosFisicos(filtroEspacioFisicoDTO: FiltroEspacioFisicoDTO): Observable<EspacioFisicoDTO> {
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/consultarEspaciosFisicos`;

		// Crear los parámetros de URL a partir del objeto filtroEspacioFisicoDTO
		let params = new HttpParams();
	
		if (filtroEspacioFisicoDTO.listaIdUbicacion && filtroEspacioFisicoDTO.listaIdUbicacion.length > 0) {
			params = params.set('listaIdUbicacion', filtroEspacioFisicoDTO.listaIdUbicacion.join(','));
		}
		if (filtroEspacioFisicoDTO.listaIdEdificio && filtroEspacioFisicoDTO.listaIdEdificio.length > 0) {
			params = params.set('listaIdEdificio', filtroEspacioFisicoDTO.listaIdEdificio.join(','));
		}
		if (filtroEspacioFisicoDTO.listaIdTipoEspacioFisico && filtroEspacioFisicoDTO.listaIdTipoEspacioFisico.length > 0) {
			params = params.set('listaIdTipoEspacioFisico', filtroEspacioFisicoDTO.listaIdTipoEspacioFisico.join(','));
		}
		if (filtroEspacioFisicoDTO.numeroEspacioFisico) {
			params = params.set('numeroEspacioFisico', filtroEspacioFisicoDTO.numeroEspacioFisico);
		}
		if (filtroEspacioFisicoDTO.estado) {
			params = params.set('estado', filtroEspacioFisicoDTO.estado.toString());
		}
		if (filtroEspacioFisicoDTO.capacidad) {
			params = params.set('capacidad', filtroEspacioFisicoDTO.capacidad.toString());
		}
		if (filtroEspacioFisicoDTO.salon) {
			params = params.set('salon', filtroEspacioFisicoDTO.salon);
		}
		params = params.set('pagina', filtroEspacioFisicoDTO.pagina?.toString() || '0');
		params = params.set('registrosPorPagina', filtroEspacioFisicoDTO.registrosPorPagina?.toString() || '10');
	
		// Realizar la solicitud GET con los parámetros
		return this.http.get<EspacioFisicoDTO>(url, { params });
	}

	/**
	 * Método encargado de consultar los tipo de espacios físicos
	 * asociados a una lista de edificios
	 * 
	 * @author apedro
	 * 
	 * @param lstIdEdificio
	 * @return
	 */
	public consultarTiposEspaciosFisicosPorEdificio(lstEdificio: string[]): Observable<TipoEspacioFisicoOutDTO[]> {
		const params = new HttpParams().set('lstEdificio', lstEdificio.join(','));
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/consultarTiposEspaciosFisicosPorEdificio`;
		return this.http.get<TipoEspacioFisicoOutDTO[]>(url, { params });
	}

	/**
	 * Método encargado de consultar todos los edificios de los espacios físicos
	 * <br>
	 * 
	 * @author apedro
	 * 
	 * @return Nombres de los edificios
	 */
	public consultarEdificios(): Observable<string[]> {
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/consultarEdificios`;
		return this.http.get<string[]>(url);
	}

	/**
	 * Método encargado de consultar todas las ubicaciones<br>
	 * 
	 * @author apedro
	 * 
	 * @return Lista de instancias UbicacionOutDTO
	 */
	public consultarUbicaciones(): Observable<UbicacionOutDTO[]> {
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/consultarUbicaciones`;
		return this.http.get<UbicacionOutDTO[]>(url);
	}

	/**
	 * Método encargado de consultar los edificios de los espacios físicos por
	 * ubicación <br>
	 * 
	 * @author apedro
	 * 
	 * @return Nombres de los edificios
	 */
	public consultarEdificiosPorUbicacion(lstUbicacion: string[]): Observable<EdificioOutDTO[]> {
		const params = new HttpParams().set('lstIdUbicacion', lstUbicacion.join(','));
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/consultarEdificiosPorUbicacion`;
		return this.http.get<EdificioOutDTO[]>(url, { params });
	}

	/**
     * Método encargado de consultar los agrupadores de espacios físicos asociados a
	 * un curso<br>
	 * 
	 * @author apedro
	 * 
	 * @param idCurso
	 * @return Lista de instancias de AgrupadorEspacioFisico
	 */
	public consultarAgrupadoresEspaciosFisicosAsociadosACursoPorIdCurso(idCurso: number): Observable<AgrupadorEspacioFisicoOutDTO[]> {
		const params = new HttpParams().set('idCurso', idCurso.toString());
		const url = `${environment.url}${this.urlAdministrarAgrupador}/consultarAgrupadoresEspaciosFisicosAsociadosACursoPorIdCurso`;
		return this.http.get<AgrupadorEspacioFisicoOutDTO[]>(url, { params });
	}

	public obtenerListaRecursos(): Observable<any[]> {
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/obtenerListaRecursos`;
		return this.http.get<any[]>(url);
	}

	public guardarEspacioFisico(save: EspacioFisicoOutDTO): Observable<EspacioFisicoDTO> {
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/guardarEspacioFisico`;
		return this.http.post<any>(url, save);
	}

	public activarInactivar(id: number): Observable<any> {
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/activarInactivarEspacioFisicio/${id}`;
        return this.http.get<any>(url);  
	}
	  
	public consultarTiposEspaciosFisicos(): Observable<TipoEspacioFisicoOutDTO[]> {
		const url = `${environment.url}${this.urlAdministrarEspacioFisico}/consultarTiposEspaciosFisicos`;
		return this.http.get<TipoEspacioFisicoOutDTO[]>(url);
	} 
	  
}