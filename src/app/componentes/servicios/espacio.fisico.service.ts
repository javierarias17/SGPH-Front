import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroEspacioFisicoDTO } from '../dto/espacio-fisico/in/filtro.espacio.fisico.dto';
import { TipoEspacioFisicoOutDTO } from '../dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoOutDTO } from '../dto/espacio-fisico/out/espacio.fisico.out.dto';
import { AgrupadorEspacioFisicoOutDTO } from '../dto/espacio-fisico/out/agrupador.espacio.fisico.out.dto';
import { UbicacionOutDTO } from '../dto/espacio-fisico/out/ubicacion.out.dto';
import { EspacioFisicoDTO } from '../dto/espacio-fisico/out/espacio.fisico.dto';
import { EdificioOutDTO } from '../dto/espacio-fisico/out/edificio.out.dto';
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
		return this.http.post<EspacioFisicoDTO>(url, filtroEspacioFisicoDTO);
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