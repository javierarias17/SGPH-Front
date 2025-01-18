import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { EmailService } from 'src/app/componentes/common/services/email.service';
import { ReservaTemporalService } from 'src/app/componentes/common/services/reserva.temporal.service';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';

@Component({
  selector: 'app-seguimiento-reserva-temporal',
  templateUrl: './seguimiento.reserva.temporal.component.html',
  styleUrls: ['./seguimiento.reserva.temporal.component.css']
})
export class SeguimientoReservaTemporalComponent implements OnInit {
  reservas: any[] = [];
  totalRecords: number = 0;
  rows: number = 10; 
  loading: boolean = false;
  page: number = 0;

  tipoIdentificacion: string | null = null;
  identificacion: string | null = null;
  estado: string | null = 'RESERVA_PENDIENTE';

  mostrarModalMotivo: boolean = false;
  motivo: string = '';
  reservaSeleccionada: any = null;
  accion: 'aprobar' | 'rechazar' | null = null;
  mostrarDialogo: boolean = false;
  mostrarDialogoReserva: boolean = false;

  estadosReserva = [
    { label: 'Pendiente', value: 'RESERVA_PENDIENTE' },
    { label: 'Aprobada', value: 'RESERVA_APROBADA' },
    { label: 'Rechazada', value: 'RESERVA_RECHAZADA' },
    { label: 'Finalizada', value: 'RESERVA_FINALIZADA' }
  ];

  public messages: Message[] = null;

  constructor(
    private reservaTemporalService: ReservaTemporalService,
    public periodoAcademicoSharedService: PeriodoAcademicoSharedService,
    private messageService: MessageService,
    private emailService: EmailService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.consultarPeriodoAcademicoVigente();
    this.consultarReservas(); 
    this.reservaTemporalService.reservasActualizadas$.subscribe(() => {
      this.consultarReservas(); // Actualiza las reservas automáticamente
    });
  }

  consultarReservas() {
    this.loading = true;

    const params = {
      tipoIdentificacion: this.tipoIdentificacion || '',
      identificacion: this.identificacion || '',
      estado: this.estado || '',
      page: this.page,
      size: this.rows,
    };

    this.reservaTemporalService.consultarReservas(params).subscribe({
      next: (data: any) => {
        this.reservas = (data.content || []).map((reserva: any) => ({
          ...reserva,
          estado: this.transformarEstadoReserva(reserva.estado), 
        }));
        this.totalRecords = data.totalElements || 0; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al consultar reservas:', err);
        this.reservas = [];
        this.totalRecords = 0;
        this.loading = false;
      },
    });
  }

  filtrarReservas() {
    this.loading = true;
  
    // Inicializamos los parámetros
    const params: any = {
      page: this.page || 0,
      size: this.rows || 10,
    };
  
    // Solo agregamos tipoIdentificacion si tiene un valor
    if (this.tipoIdentificacion?.trim()) {
      params.tipoIdentificacion = this.tipoIdentificacion.trim();
    }
  
    // Solo agregamos identificacion si tiene un valor
    if (this.identificacion?.trim()) {
      params.identificacion = this.identificacion.trim();
    }

    if(this.estado?.trim()){
      params.estado = this.estado.trim();
    }
  
    if (!params.tipoIdentificacion && !params.identificacion && !params.estado) {
      console.warn("Debe seleccionar al menos un filtro");
      this.reservas = [];
      this.totalRecords = 0;
      this.loading = false;
      return;
    }

    this.reservaTemporalService.consultarReservas(params).subscribe({
      next: (data: any) => {
        this.reservas = (data.content || []).map((reserva: any) => ({
          ...reserva,
          estado: this.transformarEstadoReserva(reserva.estado), 
        }));
        this.totalRecords = data.totalElements || 0; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al filtrar reservas:', err);
        this.reservas = [];
        this.totalRecords = 0;
        this.loading = false;
      },
    });
  }
  
  cambiarPagina(event: any) {
    this.page = event.first / event.rows; 
    this.rows = event.rows; 
    this.consultarReservas();
  }

  verReserva(reserva: any) {
    console.log('Ver reserva', reserva);
  }

  aprobarReserva(reserva: any) {
    this.accion = 'aprobar';
    this.reservaSeleccionada = reserva;
    this.mostrarModalMotivo = true;
    this.motivo = 'Aprobación automática.'; // Motivo por defecto
  }
  
  rechazarReserva(reserva: any) {
    this.accion = 'rechazar';
    this.reservaSeleccionada = reserva;
    this.mostrarModalMotivo = true;
    this.motivo = ''; // Motivo por defecto para rechazar
  }

  private consultarPeriodoAcademicoVigente(): void {
    this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(
      (r: any) => {
        if (r) {
          this.messages = null;
        } else {
          this.messages = [
            {
              severity: 'error',
              summary: 'No existe periodo académico vigente',
              detail: 'No podrá acceder a esta funcionalidad si no existe un periodo académico abierto.',
            },
          ];
        }
      },
      (error) => {
        console.error('Error al consultar periodo académico:', error);
      }
    );
  }

  transformarEstadoReserva(estado: string): string {
    switch (estado) {
      case 'RESERVA_APROBADA':
        return 'APROBADA';
      case 'RESERVA_PENDIENTE':
        return 'PENDIENTE';
      case 'RESERVA_RECHAZADA':
        return 'RECHAZADA';
      case 'RESERVA_FINALIZADA':
        return 'FINALIZADA'
      default:
        return 'DESCONOCIDO'; 
    }
  }
  
  confirmarAccion() {
    if (this.accion === 'aprobar') {
      this.reservaTemporalService.aprobarReserva(this.reservaSeleccionada.idReserva, this.motivo).subscribe({
        next: () => {
          this.enviarCorreo('aprobada');
          this.messageService.add({ severity: 'success', summary: 'Reserva aprobada correctamente.' });
          this.consultarReservas();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error al aprobar la reserva.' });
        },
        complete: () => {
          this.mostrarModalMotivo = false;
        },
      });
    } else if (this.accion === 'rechazar') {
      this.reservaTemporalService.rechazarReserva(this.reservaSeleccionada.idReserva, this.motivo).subscribe({
        next: () => {
          this.enviarCorreo('rechazada');
          this.messageService.add({ severity: 'success', summary: 'Reserva rechazada correctamente.' });
          this.consultarReservas();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error al rechazar la reserva.' });
        },
        complete: () => {
          this.mostrarModalMotivo = false;
        },
      });
    }
  }

  abrirModal(reserva: any, accion: 'aprobar' | 'rechazar') {
    this.reservaSeleccionada = reserva;
    this.accion = accion;
    this.mostrarModalMotivo = true;
    this.motivo = accion === 'rechazar' ? '' : 'Aprobación automática.';
  }
  
  public cerrarModal(): void {
    this.mostrarModalMotivo = false;
    this.motivo = '';
    this.accion = null;
    this.reservaSeleccionada = null;
  }
  
  public enviarMotivo(): void {
    console.log("RESERVA SELECCIONADA", this.reservaSeleccionada);
    if (!this.reservaSeleccionada || !this.reservaSeleccionada.idReserva) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Reserva no seleccionada.' });
      return;
    }
  
    if (!this.motivo || this.motivo.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar un motivo.' });
      return;
    }
  
    if (this.accion === 'aprobar') {
      this.reservaTemporalService.aprobarReserva(this.reservaSeleccionada.idReserva, this.motivo).subscribe({
        next: () => {
          this.enviarCorreo('aprobada');
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva aprobada correctamente.' });
          this.consultarReservas();
        },
        error: (error) => {
          console.error('Error al aprobar la reserva:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo aprobar la reserva.' });
        },
        complete: () => {
          this.cerrarModal();
        }
      });
    } else if (this.accion === 'rechazar') {
      this.reservaTemporalService.rechazarReserva(this.reservaSeleccionada.idReserva, this.motivo).subscribe({
        next: () => {
          this.enviarCorreo('rechazada');
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva rechazada correctamente.' });
          this.consultarReservas();
        },
        error: (error) => {
          console.error('Error al rechazar la reserva:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo rechazar la reserva.' });
        },
        complete: () => {
          this.cerrarModal();
        }
      });
    }
  }
  
  private enviarCorreo(accion: string): void {
    const datosCorreo = {
      nombre: this.reservaSeleccionada.usuario,
      to_email: this.reservaSeleccionada.correo,
      idReserva: this.reservaSeleccionada.idReserva,
      accion: accion === 'aprobada' ? 'aprobada' : 'rechazada',
      fechaReserva: this.reservaSeleccionada.fechaReserva,
      horaInicio: this.reservaSeleccionada.horaInicio,
      horaFin: this.reservaSeleccionada.horaFin,
      salon: this.reservaSeleccionada.salon,
      observaciones: this.motivo,
    };

    console.log("DATOS DEL CORREO", datosCorreo);
    this.emailService.enviarCorreo(datosCorreo).then(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Notificacion de reserva enviada correctamente.' });
        console.log('Correo enviado exitosamente', response);
      },
      (error) => {
        console.error('Error al enviar el correo', error);
      }
    );
  }

  verInformacionReserva(reserva: any): void {
    this.mostrarDialogo = false; // Asegúrate de reiniciar el estado
    setTimeout(() => {
      this.reservaSeleccionada = reserva; // Asigna la reserva seleccionada
      this.mostrarDialogo = true; // Abre el modal
    }, 0);
  }
  
  registrarReserva(): void {
    this.mostrarDialogoReserva = false; // Asegúrate de reiniciar el estado
    setTimeout(() => {
      this.mostrarDialogoReserva = true; // Abre el modal
    }, 0);
  }

  descargarHistorialExcel(): void {
    this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe({
      next: (periodoVigente: any) => {
        console.log("PERIODO VIGENTE", periodoVigente);
        if (!periodoVigente || !periodoVigente.idPeriodoAcademico) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No hay un periodo académico vigente para descargar el historial.'
          });
          return;
        }
  
        this.reservaTemporalService.descargarHistorialReservas(periodoVigente.idPeriodoAcademico).subscribe({
          next: (blob) => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = `historial_reservas_${periodoVigente.idPeriodo}.xlsx`;
            a.click();
            URL.revokeObjectURL(objectUrl);
          },
          error: (err) => {
            console.error('Error al descargar el historial de reservas:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo descargar el historial de reservas.'
            });
          }
        });
      },
      error: (err) => {
        console.error('Error al consultar el periodo académico vigente:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo consultar el periodo académico vigente.'
        });
      }
    });
  }
  
}
