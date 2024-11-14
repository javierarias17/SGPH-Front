import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CursoDTO } from '../../datos/gestionar-curso/model/curso-dto';
import { environment } from 'src/environments/environment';

@Injectable()
export class CursoService{

    urlCurso: string = "AdministrarCurso"
    constructor(private http: HttpClient) {
    }
	public consultarCursoPorId(idCurso: number) : Observable<CursoDTO> {
		const ur = environment.url + this.urlCurso + `/obtenerCurso/${idCurso}`
		return this.http.get<CursoDTO>(ur)
	}
	public guardarCurso(curso: any): Observable<any> {
		const ur = environment.url + this.urlCurso + `/guardarCurso`
		return this.http.post(ur,curso)
	}
	public eliminarCurso(curso: number): Observable<any> {
		const ur = environment.url + this.urlCurso + `/eliminarCurso/${curso}`
		return this.http.get(ur)
	}
}