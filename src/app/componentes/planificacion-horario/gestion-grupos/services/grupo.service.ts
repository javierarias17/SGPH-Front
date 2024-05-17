import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  urlAgrupador: string = "AdministrarEspacioFisico"
  
  constructor(private httpClient: HttpClient) { }


  public obtenerAgrupadorEspacioFisico(filtro: any): Observable<any> {
    const url = `${environment.url}${this.urlAgrupador}/filtrarGrupos`;
    return this.httpClient.post<AgrupadorEspacioFiscioDTO[]>(url, filtro);
  }
  public inactivarGrupo(idGrupo: number): Observable<any> {
    const url = `${environment.url}${this.urlAgrupador}/inactivarGrupo/${idGrupo}`;
    return this.httpClient.get<AgrupadorEspacioFiscioDTO[]>(url);
  }
  public guardarGrupo(grupo: AgrupadorEspacioFiscioDTO): Observable<AgrupadorEspacioFiscioDTO> {
    const url = `${environment.url}${this.urlAgrupador}/guardarGrupo`;
    return this.httpClient.post<AgrupadorEspacioFiscioDTO>(url, grupo);
  }
  public obtenerEspacioFiscioAgrupador(idGrupo: number): Observable<any> {
    const url = `${environment.url}${this.urlAgrupador}/obtenerEspaciosFisicosAsignadosAAgrupadorId/${idGrupo}`;
    return this.httpClient.get<any>(url);
  }
  public obtenerEspacioFiscioSinAsignarAlGrupo(idGrupo: number): Observable<any> {
    const url = `${environment.url}${this.urlAgrupador}/obtenerEspaciosFisicosSinAsignarAAgrupadorId/${idGrupo}`;
    return this.httpClient.get<any>(url);
  }
}