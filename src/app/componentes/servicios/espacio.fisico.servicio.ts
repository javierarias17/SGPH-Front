import { HttpClient } from '@angular/common/http';
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
export class EspacioFisicoServicio {

    constructor(private http: HttpClient) {
    }

    //Servicio utilizado en la pantalla de Gestionar espacios físicos
    public consultarEspacioFisicoPorIdEspacioFisico(idEspacioFisico:number): Observable<EspacioFisicoOutDTO>{
        const url = `http://localhost:8081/AdministrarEspacioFisico/consultarEspacioFisicoPorIdEspacioFisico?idEspacioFisico=${idEspacioFisico}`;
        return this.http.get<EspacioFisicoOutDTO>(url);
    } 

    /**
	 * Método encargado de consultar los tipos de espacios físicos por ubicaciones
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @param lstIdUbicacion
	 * @return
	 */
    public consultarTiposEspaciosFisicosPorUbicaciones(lstIdUbicacion:number[]): Observable<TipoEspacioFisicoOutDTO[]>{
        const url = `http://localhost:8081/AdministrarEspacioFisico/consultarTiposEspaciosFisicosPorUbicaciones?lstIdUbicacion=${lstIdUbicacion.join(',')}`;
        return this.http.get<any>(url);
    }      

	/**
	 *  Método encargado de consultar los espacios físicos por diferentes criterios
	 * de busqueda y retornarlos de manera paginada
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param filtroEspacioFisicoDTO
	 * @return
	 */
	public consultarEspaciosFisicos(filtroEspacioFisicoDTO:FiltroEspacioFisicoDTO): Observable<EspacioFisicoDTO>{
        return this.http.post<EspacioFisicoDTO>("http://localhost:8081/AdministrarEspacioFisico/consultarEspaciosFisicos",filtroEspacioFisicoDTO);
    }  

	/**
	 * Método encargado de consultar los tipo de espacios físicos
	 * asociados a una lista de edificios
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param lstIdEdificio
	 * @return
	 */
	public consultarTiposEspaciosFisicosPorEdificio(lstEdificio:string[]): Observable<TipoEspacioFisicoOutDTO[]>{
		const url = `http://localhost:8081/AdministrarEspacioFisico/consultarTiposEspaciosFisicosPorEdificio?lstEdificio=${lstEdificio}`;
        return this.http.get<TipoEspacioFisicoOutDTO[]>(url);
	}  

	/**
	 * Método encargado de consultar todos los edificios de los espacios físicos
	 * <br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return Nombres de los edificios
	 */
	public consultarEdificios(): Observable<string[]>{
		const url = `http://localhost:8081/AdministrarEspacioFisico/consultarEdificios`;
        return this.http.get<string[]>(url);
    }  

	/**
	 * Método encargado de consultar todas las ubicaciones<br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return Lista de instancias UbicacionOutDTO
	 */
	public consultarUbicaciones(): Observable<UbicacionOutDTO[]>{
		const url = `http://localhost:8081/AdministrarEspacioFisico/consultarUbicaciones`;
        return this.http.get<UbicacionOutDTO[]>(url);
    }  

	/**
	 * Método encargado de consultar los edificios de los espacios físicos por
	 * ubicación <br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return Nombres de los edificios
	 */
	public consultarEdificiosPorUbicacion(lstUbicacion: string[]): Observable<EdificioOutDTO[]>{
		const url = `http://localhost:8081/AdministrarEspacioFisico/consultarEdificiosPorUbicacion?lstIdUbicacion=${lstUbicacion}`;
        return this.http.get<EdificioOutDTO[]>(url);
    }  

	/**
     * Método encargado de consultar los agrupadores de espacios físicos asociados a
	 * un curso<br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @param idCurso
	 * @return Lista de instancias de AgrupadorEspacioFisico
	 */
	public consultarAgrupadoresEspaciosFisicosAsociadosACursoPorIdCurso(idCurso: number): Observable<AgrupadorEspacioFisicoOutDTO[]>{
		const url = `http://localhost:8081/AdministrarEspacioFisico/consultarAgrupadoresEspaciosFisicosAsociadosACursoPorIdCurso?idCurso=${idCurso}`;
        return this.http.get<AgrupadorEspacioFisicoOutDTO[]>(url);
    }
	public obtenerListaRecursos(): Observable<any[]>{
		const url = `http://localhost:8081/AdministrarEspacioFisico/obtenerListaRecursos`;
        return this.http.get<any[]>(url);
    }
	public guardarEspacioFisico(save: EspacioFisicoDTO): Observable <EspacioFisicoDTO> {
        const url = `${environment.url}AdministrarEspacioFisico/guardarEspacioFisico`;
        return this.http.post<any>(url, save);   
    }
	public activarInactivar(id: number): Observable<any> {
		const url = `${environment.url}AdministrarEspacioFisico/activarInactivarEspacioFisicio/${id}`;
        return this.http.get<any>(url);  
	}
 
}