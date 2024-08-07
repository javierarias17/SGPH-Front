import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';
import { AgrupadorEspacioFiscioDTO } from '../model/AgrupadorEspacioFisicoDTO';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  urlAgrupador: string = "AdministrarAgrupador"
  urlFacultad: string = "AdministrarFacultad"
  urlReporte: string = "reporte";
  urlDocente: string = "AdministrarDocente";
  constructor(private http: HttpClient) { }

  public obtenerAgrupadorEspacioFisico(ídFacultades: number[]): Observable<AgrupadorEspacioFiscioDTO[]> {
    const url = `${environment.url}${this.urlAgrupador}/consultarAgrupadoresEspaciosFisicosPorIdFacultad`;
    let idFacultadesStr = ídFacultades.join(',');
    let params = new HttpParams().set('idFacultad', idFacultadesStr);
    return this.http.get<AgrupadorEspacioFiscioDTO[]>(url, { params: params });
  }
  public consultarFacultades(): Observable<FacultadOutDTO[]>{
    const url = `${environment.url}${this.urlFacultad}/consultarFacultades`;
    return this.http.get<FacultadOutDTO[]>(url);
  }
  public obtenerReporteSimca(filtro: any): Observable<any> {
    const url = `${environment.url}${this.urlReporte}/simca`;
    return this.http.post<any>(url, filtro);
  } 
  public obtenerReporteDocente(filtro: any): Observable<any> {
    const url = `${environment.url}${this.urlReporte}/laborDocente`;
    return this.http.post<any>(url, filtro);
  }
  public obtenerVisualizarLaborDocente(filtro: any): Observable<any> {
    const url = `${environment.url}${this.urlDocente}/consultaLaborDocente`;
    return this.http.post<any>(url, filtro);
  }
  public cargarLaborDocente(filtro: any): Observable<any> {
    const url = `${environment.url}${this.urlDocente}/cargarLaborDocente`;
    return this.http.post<any>(url, filtro);
  }
}
