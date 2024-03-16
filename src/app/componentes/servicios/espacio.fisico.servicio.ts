import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroEspacioFisicoDTO } from '../dto/espacio-fisico/in/filtro.espacio.fisico.dto';
import { TipoEspacioFisicoOutDTO } from '../dto/espacio-fisico/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoOutDTO } from '../dto/espacio-fisico/out/espacio.fisico.out.dto';



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
	 * Método encargado de consultar los tipos de espacios físicos por facultad
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @param lstIdFacultad
	 * @return
	 */
    public consultarTiposEspaciosFisicosPorIdFacultad(lstIdFacultad:number[]): Observable<TipoEspacioFisicoOutDTO[]>{
        const url = `http://localhost:8081/AdministrarEspacioFisico/consultarTiposEspaciosFisicosPorIdFacultad?lstIdFacultad=${lstIdFacultad.join(',')}`;
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
	public consultarTiposEspaciosFisicosPorIdEdificio(lstIdEdificio:number[]): Observable<TipoEspacioFisicoOutDTO[]>{
		const url = `http://localhost:8081/AdministrarEspacioFisico/consultarTiposEspaciosFisicosPorIdEdificio?lstIdEdificio=${lstIdEdificio}`;
        return this.http.get<TipoEspacioFisicoOutDTO[]>(url);
    }  

}