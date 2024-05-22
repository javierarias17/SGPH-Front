import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeriodoAcademicoOutDTO } from '../model/periodo.academico.out.';


@Injectable()
export class PeriodoAcademicoService{

    public subject =new Subject<any>;

    urlAgrupador: string = "AdministrarPeriodoAcademico"
    constructor(private http: HttpClient) {
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