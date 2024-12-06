import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacultadOutDTO } from 'src/app/componentes/common/model/facultad/out/facultad.out.dto';
import { AgrupadorEspacioFisicoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/agrupador.espacio.fisico.dto';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  urlAgrupador: string = "AdministrarAgrupador"
  urlFacultad: string = "AdministrarFacultad"
  urlReporte: string = "reporte";
  urlDocente: string = "AdministrarDocente";
  constructor(private http: HttpClient) { }

  public obtenerAgrupadorEspacioFisico(ídFacultades: number[]): Observable<AgrupadorEspacioFisicoDTO[]> {
    const url = `${environment.url}${this.urlAgrupador}/consultarAgrupadoresEspaciosFisicosPorIdFacultad`;
    let idFacultadesStr = ídFacultades.join(',');
    let params = new HttpParams().set('idFacultad', idFacultadesStr);
    return this.http.get<AgrupadorEspacioFisicoDTO[]>(url, { params: params });
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
  public importarLaborDocente(docenteLaborList: any[], idFacultad: number, idPrograma: number): Observable<any> {
    const url = `${environment.url}${this.urlDocente}/importar/${idFacultad}/${idPrograma}`;
    return this.http.post<any>(url, docenteLaborList);
  }
  public obtenerReporteEspacioFisico(filtro: any): Observable<any> {
    const url = `${environment.url}${this.urlReporte}/espacioFisico`;
    return this.http.post<any>(url, filtro);
  }  
}
