import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaTemporalService {

  private urlReservaTemporal: string = `${environment.url}AdministrarReservaTemporal`;

  private reservasActualizadas = new Subject<void>();

  reservasActualizadas$ = this.reservasActualizadas.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Método para cargar el formulario con datos del usuario.
   * 
   * @param username Nombre de usuario.
   * @returns Información del formulario de reserva.
   */
  public cargarFormulario(username: string): Observable<any> {
    const url = `${this.urlReservaTemporal}/formulario`;
    const params = new HttpParams().set('username', username);
    return this.http.get<any>(url, { params });
  }

  /**
   * Método para consultar las franjas libres disponibles.
   * 
   * @param filtro Objeto con los filtros de búsqueda.
   * @returns Lista de franjas libres.
   */
  public consultarFranjasLibres(filtro: any): Observable<any> {
    const url = `${this.urlReservaTemporal}/consultarFranjasLibresReservas`;

    // Convertir el objeto filtro en parámetros de URL
    let params = new HttpParams();
    if (filtro.idEspacioFisico) {
      params = params.set('idEspacioFisico', filtro.idEspacioFisico);
    }
    if (filtro.dia) params = params.set('diaSemana', filtro.dia);
    if (filtro.horaInicio) {
      params = params.set('horaInicio', filtro.horaInicio);
    }
    if (filtro.horaFin) {
      params = params.set('horaFin', filtro.horaFin);
    }
    if (filtro.salon) {
      params = params.set('salon', filtro.salon);
    }
    if (filtro.idUbicacion && Array.isArray(filtro.idUbicacion)) {
      filtro.idUbicacion.forEach((id: number) => {
        params = params.append('ubicacion', id.toString());
      });
    } else if (filtro.idUbicacion) {
      params = params.set('ubicacion', filtro.idUbicacion.toString());
    }
    if(filtro.fechaReserva){
      params = params.set('fechaReserva', filtro.fechaReserva)
    }

    if (filtro.listaRecursos && filtro.listaRecursos.length > 0) {
      filtro.listaRecursos.forEach((id: number) => {
        params = params.append('recursos', id.toString());
      });
    }    

    params = params.set('pagina', filtro.pagina || '0');
    params = params.set('registrosPorPagina', filtro.registrosPorPagina || '10');

    return this.http.get<any>(url, { params });
  }

  /**
   * Método para realizar una reserva temporal.
   * 
   * @param reserva Objeto con los datos de la reserva.
   * @returns Confirmación de la reserva.
   */
  public guardarReserva(reserva: any): Observable<any> {
    const url = `${this.urlReservaTemporal}/guardarReserva`;
    return this.http.post<any>(url, reserva);
  }

  /**
   * Método para consultar todas las reservas temporales.
   * 
   * @returns Lista de reservas temporales.
   */
  public consultarReservas(params: any): Observable<any> {
    const url = `${this.urlReservaTemporal}/consultarReservas`;
    return this.http.get<any>(url, { params });
  }
  
  /**
   * Método para aprobar la reserva temporal.
   * 
   * @returns reserva temporal actualizada.
   */
  public aprobarReserva(reservaId: number, motivo: string): Observable<any> {
    if (!reservaId || !motivo) {
      throw new Error('Los parámetros reservaId y motivo son obligatorios');
    }
  
    const url = `${this.urlReservaTemporal}/aprobarReserva`;
    const params = new HttpParams()
      .set('reservaId', reservaId.toString())
      .set('motivo', motivo);
  
    return this.http.post<any>(url, {}, { params });
  }
  
  
  /**
   * Método para rechazar la reserva temporal.
   * 
   * @returns reserva temporal actualizada.
   */
  public rechazarReserva(reservaId: number, motivo: string): Observable<any> {
    const url = `${this.urlReservaTemporal}/rechazarReserva`;
    const params = new HttpParams()
      .set('reservaId', reservaId.toString())
      .set('motivo', motivo);
    return this.http.post<any>(url, null, { params });
  }
  
  notificarActualizacion(): void {
    this.reservasActualizadas.next();
  }
}
