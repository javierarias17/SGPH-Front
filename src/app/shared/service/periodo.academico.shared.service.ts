import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PeriodoAcademicoOutDTO } from 'src/app/componentes/periodo-academico/gestionar-periodo-academico/model/out/periodo-academico-out-dto';
import { environment } from 'src/environments/environment';


@Injectable()
export class PeriodoAcademicoSharedService {

    public subject =new Subject<any>;

    urlAdministrarPeriodoAcademico: string = "AdministrarPeriodoAcademico"
    constructor(private http: HttpClient) {
    }
       
    /**
	 * Método encargado de consultar los periodos académicos por filtro<br>
	 * 
	 * @author apedro
	 * 
	 * @return Lista de instancias PeriodoAcademicoOutDTO
	 */
    public consultarPeriodosAcademicos(filtro: any): Observable<any> {
        const url = `${environment.url}${this.urlAdministrarPeriodoAcademico}/consultarPeriodosAcademicos`;
    
        // Crear los parámetros de URL a partir del objeto filtroPeriodoAcademicoDTO
        let params = new HttpParams();
        if (filtro.pagina !== undefined && filtro.pagina !== null) {
            params = params.set('pagina', filtro.pagina.toString());
        }
        if (filtro.registrosPorPagina !== undefined && filtro.registrosPorPagina !== null) {
            params = params.set('registrosPorPagina', filtro.registrosPorPagina.toString());
        }
        // Realizar la solicitud GET con los parámetros
        return this.http.get<any>(url, { params });
    }

    /**
	 * Método encargado de consultar el periodo académico vigente<br>
	 * 
	 * @author apedro
	 * 
	 * @return
	 */
    public consultarPeriodoAcademicoVigente(): Observable<PeriodoAcademicoOutDTO>{
        const url = `${environment.url}${this.urlAdministrarPeriodoAcademico}/consultarPeriodoAcademicoVigente`;
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