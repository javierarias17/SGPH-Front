import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AgrupadorEspacioFiscioDTO } from '../model/AgrupadorEspacioFisicoDTO';
import { FacultadOutDTO } from 'src/app/componentes/dto/facultad/out/facultad.out.dto';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  urlAgrupador: string = "AdministrarEspacioFisico"
  urlFacultad: string = "AdministrarFacultad"
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
}