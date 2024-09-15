import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgrupadorEspacioFisicoDTO } from 'src/app/componentes/dto/espacio-fisico/out/agrupador.espacio.fisico.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgrupadorService {
  urlAgrupador: string = "AdministrarAgrupador"
  urlEspacioFisico: string = "AdministrarEspacioFisico"
  
  constructor(private httpClient: HttpClient) { }


  public filtrarGrupos(filtro: any): Observable<any> {
    const url = `${environment.url}${this.urlAgrupador}/filtrarGrupos`;
    return this.httpClient.post<AgrupadorEspacioFisicoDTO[]>(url, filtro);
  }
  public guardarGrupo(grupo: AgrupadorEspacioFisicoDTO): Observable<AgrupadorEspacioFisicoDTO> {
    const url = `${environment.url}${this.urlAgrupador}/guardarGrupo`;
    return this.httpClient.post<AgrupadorEspacioFisicoDTO>(url, grupo);
  }
  public obtenerEspacioFiscioAgrupador(idGrupo: number): Observable<any> {
    const url = `${environment.url}${this.urlEspacioFisico}/obtenerEspaciosFisicosAsignadosAAgrupadorId/${idGrupo}`;
    return this.httpClient.get<any>(url);
  }
  public obtenerEspacioFiscioSinAsignarAlGrupo(idGrupo: number): Observable<any> {
    const url = `${environment.url}${this.urlEspacioFisico}/obtenerEspaciosFisicosSinAsignarAAgrupadorId/${idGrupo}`;
    return this.httpClient.get<any>(url);
  }
  public obtenerEspacioFiscioDispinibleFiltro(filtro: any): Observable<any> {
    const url = `${environment.url}${this.urlEspacioFisico}/consultarEspacioFisicoConFiltro`;
    return this.httpClient.post<any>(url, filtro);
  }
  public guardarAsignacion(agrupacion: any): Observable<any> {
    const url = `${environment.url}${this.urlAgrupador}/guardarAsignacion`;
    return this.httpClient.post<AgrupadorEspacioFisicoDTO>(url, agrupacion);
  }
}
