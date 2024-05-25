import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroEspacioFisicoDTO } from '../dto/espacio-fisico/in/filtro.espacio.fisico.dto';
import { TipoEspacioFisicoOutDTO } from '../dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoOutDTO } from '../dto/espacio-fisico/out/espacio.fisico.out.dto';
import { AgrupadorEspacioFisicoOutDTO } from '../dto/espacio-fisico/out/agrupador.espacio.fisico.out.dto';
import { UbicacionOutDTO } from '../dto/espacio-fisico/out/ubicacion.out.dto';



@Injectable()
export class EspacioFisicoServicio{

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
	 * Método encargado de obtener los espacios físicos dado un conjunto de criterios de
	 * busqueda.
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param filtroEspacioFisicoDTO
	 * @return
	 */
	public consultarEspaciosFisicos(filtroEspacioFisicoDTO:FiltroEspacioFisicoDTO): Observable<any>{
        return this.http.post<any>("http://localhost:8081/AdministrarEspacioFisico/consultarEspaciosFisicos",filtroEspacioFisicoDTO);
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
	public consultarEdificiosPorUbicacion(lstUbicacion: string[]): Observable<string[]>{
		const url = `http://localhost:8081/AdministrarEspacioFisico/consultarEdificiosPorUbicacion?lstUbicacion=${lstUbicacion}`;
        return this.http.get<string[]>(url);
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
}