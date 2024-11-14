import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeriodoAcademicoInDTO } from 'src/app/componentes/periodo-academico/gestionar-periodo-academico/model/in/periodo-academico-in-dto';
import { PeriodoAcademicoOutDTO } from '../model/out/periodo-academico-out-dto';


@Injectable()
export class PeriodoAcademicoService {

    public subject =new Subject<any>;

    urlAdministrarPeriodoAcademico: string = "AdministrarPeriodoAcademico"
    constructor(private http: HttpClient) {
    }

    /**
	 * Método encargado de guardar o actualizar un periodo académico <br>
	 * 
	 * @author apedro
	 * 
	 * @param periodoAcademicoInDTO
	 * @return
	 */
     public guardarPeriodoAcademico(periodoAcademicoInDTO:PeriodoAcademicoInDTO): Observable<any>{
        const url = `${environment.url}${this.urlAdministrarPeriodoAcademico}/guardarPeriodoAcademico`;
        return this.http.post<any>(url, periodoAcademicoInDTO);
    }
}