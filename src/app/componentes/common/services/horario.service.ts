import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FranjaLibreOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/franaja.libre.out.dto';


@Injectable({
    providedIn: 'root',
  })
export class HorarioService{

    private baseUrl = `${environment.url}AdministrarHorario`;
    
    constructor(private http: HttpClient) {
    }

    consultarFranjasLibres(filtro: any): Observable<{ content: FranjaLibreOutDTO[]; totalElements: number }> {
        const url = `${this.baseUrl}/consultarFranjasLibres`;
    
        let params = new HttpParams();
        if (filtro.pagina !== undefined && filtro.pagina !== null) {
          params = params.set('pagina', filtro.pagina.toString());
        }
    
        if (filtro.registrosPorPagina !== undefined && filtro.registrosPorPagina !== null) {
          params = params.set('registrosPorPagina', filtro.registrosPorPagina.toString());
        }
        
        if (filtro.salon) params = params.set('salon', filtro.salon);
        if (filtro.dia) params = params.set('diaSemana', filtro.dia);
        if (filtro.horaInicio) params = params.set('horaInicio', filtro.horaInicio);
        if (filtro.horaFin) params = params.set('horaFin', filtro.horaFin);
        if (filtro.idUbicacion && Array.isArray(filtro.idUbicacion)) {
          filtro.idUbicacion.forEach((id: number) => {
            params = params.append('ubicacion', id.toString());
          });
        } else if (filtro.idUbicacion) {
          params = params.set('ubicacion', filtro.idUbicacion.toString());
        }
        
    
        if (filtro.pagina !== undefined) {
          params = params.set('pagina', filtro.pagina.toString());
          params = params.set('registrosPorPagina', filtro.registrosPorPagina.toString());
        }

        return this.http.get<{ content: FranjaLibreOutDTO[]; totalElements: number }>(url, { params });
      }
}
