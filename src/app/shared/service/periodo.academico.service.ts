import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeriodoAcademicoOutDTO } from '../model/periodo.academico.out.';
import { FiltroBase } from 'src/app/componentes/dto/filtro-base';
import { PeriodoAcademicoInDTO } from 'src/app/componentes/periodo-academico/gestionar-periodo-academico/model/periodo-academico-in-dto';


@Injectable()
export class PeriodoAcademicoService{

    public subject =new Subject<any>;

    urlAgrupador: string = "AdministrarPeriodoAcademico"
    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de guardar o actualizar un periodo académico <br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @param periodoAcademicoInDTO
	 * @return
	 */
     public guardarPeriodoAcademico(periodoAcademicoInDTO:PeriodoAcademicoInDTO): Observable<any>{
        const url = `${environment.url}${this.urlAgrupador}/guardarPeriodoAcademico`;
        return this.http.post<any>(url, periodoAcademicoInDTO);
    }
    
    /**
	 * Método encargado de consultar los periodos académicos por filtro<br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return Lista de instancias PeriodoAcademicoOutDTO
	 */
    public consultarPeriodosAcademicos(filtro:any): Observable<any>{
        const url = `${environment.url}${this.urlAgrupador}/consultarPeriodosAcademicos`;
        return this.http.post<any>(url, filtro);
    }

    /**
	 * Método encargado de consultar el periodo académico vigente<br>
	 * 
	 * @author Pedro Javier Arias Lasso <apedro@unicauca.edu.co>
	 * 
	 * @return
	 */
    public consultarPeriodoAcademicoVigente(): Observable<PeriodoAcademicoOutDTO>{
        const url = `${environment.url}${this.urlAgrupador}/consultarPeriodoAcademicoVigente`;
        return this.http.get<PeriodoAcademicoOutDTO>(url);
    }

    public emitirDataPeriodoVigente(){  
        this.consultarPeriodoAcademicoVigente().subscribe(r=>{
            this.subject.next(r);
        })
    }

    public subcribirDataPeriodoAcademico():Observable<PeriodoAcademicoOutDTO>{
        return this.subject.asObservable();
    }    
}