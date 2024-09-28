import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgrupadorEspacioFiscioDTO } from 'src/app/shared/model/AgrupadorEspacioFisicoDTO';
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

    // Crear los parámetros de URL a partir del objeto filtro
    let params = new HttpParams();

    if (filtro.listaIdFacultades && filtro.listaIdFacultades.length > 0) {
        params = params.set('listaIdFacultades', filtro.listaIdFacultades.join(','));
    }
    if (filtro.nombre) {
        params = params.set('nombre', filtro.nombre);
    }
    if (filtro.pageNumber !== undefined) {
        params = params.set('pageNumber', filtro.pageNumber.toString());
    }
    if (filtro.pageSize !== undefined) {
        params = params.set('pageSize', filtro.pageSize.toString());
    }
    // Realizar la solicitud GET con los parámetros
    return this.httpClient.get<AgrupadorEspacioFiscioDTO[]>(url, { params });
  }
  public guardarGrupo(grupo: AgrupadorEspacioFiscioDTO): Observable<AgrupadorEspacioFiscioDTO> {
    const url = `${environment.url}${this.urlAgrupador}/guardarGrupo`;
    return this.httpClient.post<AgrupadorEspacioFiscioDTO>(url, grupo);
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
    
    let params = new HttpParams();
    params = params.set('ubicacion', filtro.ubicacion);
    params = params.set('nombre', filtro.nombre);
    params = params.set('tipo', filtro.tipo);
    params = params.set('idAgrupador', filtro.idAgrupador.toString());

    return this.httpClient.get<any>(url, { params });
  }
  public guardarAsignacion(agrupacion: any): Observable<any> {
    const url = `${environment.url}${this.urlAgrupador}/guardarAsignacion`;
    return this.httpClient.post<AgrupadorEspacioFiscioDTO>(url, agrupacion);
  }
}
