import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FranjaHorariaAulaDTO } from '../dto/aula/out/franja.horaria.aula.dto';
import { TipoAulaOutDTO } from '../dto/aula/out/tipo.aula.out.dto';
import { AulaOutDTO } from '../dto/aula/out/aula.out.dto';
import { FranjaHorariaCursoDTO } from '../dto/curso/out/franja.horaria.curso.dto';
import { FormatoPresentacionFranjaHorariaCursoDTO } from '../dto/aula/out/formato.presentacion.franja.horaria.curso.dto';
import { FiltroAulaDTO } from '../dto/aula/in/FiltroAulaDTO';


@Injectable()
export class AulaServicio{

    constructor(private http: HttpClient) {
    }

    //Servicio utilizado en la pantalla de Gestionar Aulas
    public consultarAulaPorIdAula(idAula:number): Observable<AulaOutDTO>{
        const url = `http://localhost:8081/AdministrarAula/consultarAulaPorIdAula?idAula=${idAula}`;
        return this.http.get<AulaOutDTO>(url);
    } 

    /**
	 * Método encargado de consultar los tipos de aulas por facultad
	 * 
	 * @author Pedro Javier Arias Lasso <parias@heinsohn.com.co>
	 * 
	 * @param lstIdFacultad
	 * @return
	 */
    public consultarTipoAulasPorIdFacultad(lstIdFacultad:number[]): Observable<TipoAulaOutDTO[]>{
        const url = `http://localhost:8081/AdministrarAula/consultarTipoAulasPorIdFacultad?lstIdFacultad=${lstIdFacultad.join(',')}`;
        return this.http.get<any>(url);
    }      

	/**
	 * Método encargado de obtener las aulas dado un conjunto de criterios de
	 * busqueda.
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param filtroAulaDTO
	 * @return
	 */
	public consultarAulas(filtroAulaDTO:FiltroAulaDTO): Observable<any>{
        return this.http.post<any>("http://localhost:8081/AdministrarAula/consultarAulas",filtroAulaDTO);
    }  

	/**
	 * Método encargado de consultar los tipo de aula asociados a una lista de
	 * edificios
	 * 
	 * @author Pedro Javier Arias Lasso <parias@unicauca.com.co>
	 * 
	 * @param lstIdEdificio
	 * @return
	 */
	public consultarTipoAulasPorIdEdificio(lstIdEdificio:number[]): Observable<TipoAulaOutDTO[]>{
		const url = `http://localhost:8081/AdministrarAula/consultarTipoAulasPorIdEdificio?lstIdEdificio=${lstIdEdificio}`;
        return this.http.get<TipoAulaOutDTO[]>(url);
    }  

}