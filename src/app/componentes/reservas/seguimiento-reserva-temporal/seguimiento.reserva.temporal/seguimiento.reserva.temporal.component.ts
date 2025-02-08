import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { EmailService } from 'src/app/componentes/common/services/email.service';
import { ReservaTemporalService } from 'src/app/componentes/common/services/reserva.temporal.service';
import { UsuarioService } from 'src/app/componentes/common/services/usuario.service';
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
  accion: 'aprobar' | 'rechazar' | 'cancelar' | null = null;
  mostrarDialogo: boolean = false;
  mostrarDialogoReserva: boolean = false;

  estadosReserva = [
    { label: 'Pendiente', value: 'RESERVA_PENDIENTE' },
    { label: 'Aprobada', value: 'RESERVA_APROBADA' },
    { label: 'Rechazada', value: 'RESERVA_RECHAZADA' },
    { label: 'Finalizada', value: 'RESERVA_FINALIZADA' },
    { label: 'Cancelada', value: 'RESERVA_CANCELADA' }
  ];

  public messages: Message[] = null;

  constructor(
    private reservaTemporalService: ReservaTemporalService,
    public periodoAcademicoSharedService: PeriodoAcademicoSharedService,
    private messageService: MessageService,
    private emailService: EmailService,
    private usuarioService: UsuarioService,
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
    this.motivo = 'Reserva aprobada. Complete y entregue el formulario en la Decanatura para que la reserva sea autorizada por el decano. Puede acceder al formulario en el siguiente enlace: https://facultades.unicauca.edu.co/prlvmen/listadeformatos/pr%C3%A9stamo-de-aulas-auditorios-universitarios.'; // Motivo por defecto
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
        return 'FINALIZADA';
      case 'RESERVA_CANCELADA':
        return 'CANCELADA';
      default:
        return 'DESCONOCIDO'; 
    }
  }
  
  confirmarAccion() {
    console.log("📌 RESERVA SELECCIONADA en confirmarAccion:", this.reservaSeleccionada);

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

  abrirModal(reserva: any, accion: 'aprobar' | 'rechazar' | 'cancelar') {
    console.log("📌 Asignando reserva en abrirModal:", reserva);
    this.reservaSeleccionada = reserva;
    this.accion = accion;
    this.mostrarModalMotivo = true;
    // Ajustar el motivo inicial dependiendo de la acción
    if (accion === 'rechazar' || accion === 'cancelar') {
      this.motivo = ''; // Dejar vacío para que el usuario lo ingrese
    } else if (accion === 'aprobar') {
      this.motivo = 'Reserva aprobada. Complete y entregue el formulario en la Decanatura de la FIET para la autorización del decano. Acceda en el siguiente enlace: https://facultades.unicauca.edu.co/prlvmen/listadeformatos/pr%C3%A9stamo-de-aulas-auditorios-universitarios.'; // Motivo por defecto para aprobación
    }
  }
  
  public cerrarModal(): void {
    this.mostrarModalMotivo = false;
    this.motivo = '';
    this.accion = null;
    this.reservaSeleccionada = null;
  }
  
  public enviarMotivo(): void {
    console.log("📌 RESERVA SELECCIONADA en enviarMotivo:", this.reservaSeleccionada);
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
    } else if (this.accion === 'cancelar') {
      this.reservaTemporalService.cancelarReserva(this.reservaSeleccionada.idReserva, this.motivo).subscribe({
        next: () => {
          this.enviarCorreo('cancelada');
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reserva cancelada correctamente.' });
          this.consultarReservas();
        },
        error: (error) => {
          console.error('Error al cancelar la reserva:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cancelar la reserva.' });
        },
        complete: () => {
          this.cerrarModal();
        }
      });
    }
  }
  
  private enviarCorreo(accion: string): void {
    console.log("📌 RESERVA SELECCIONADA en enviarCorreo:", this.reservaSeleccionada);
    const motivoEnviado = this.motivo;
    console.log("📌 MOTIVO ENVIAD:", motivoEnviado);
    // Crear una referencia local antes de llamar al servicio
    const reservaSeleccionadaLocal = { ...this.reservaSeleccionada }; 

    let usuarioData = this.obtenerDatosUsuario();

    // Consultar la API para obtener el email del usuario autenticado
    this.usuarioService.consultarUsuarioAutenticado(usuarioData.nombreUsuario).subscribe({
        next: (data) => {
            console.log("DATAAAAA", reservaSeleccionadaLocal); // Ahora debería mantenerse
            console.log("MOTIVO", this.motivo);
            // Ahora tenemos el email del administrador
            const usuarioRemitente = {
                nombreUsuario: data.nombreUsuario,
                email: data.email,
            };

            let mensajeAdicional = accion === 'aprobada'
                ? 'Si por algún motivo desea cancelar la reserva, le solicitamos responder a este correo indicando que ya no necesita el espacio reservado.'
                : '';

            console.log("DATAAAA4", reservaSeleccionadaLocal); // Verificar si aún tiene datos

            
            const datosCorreo = {
                to_email: reservaSeleccionadaLocal.correo,  
                from_email: usuarioRemitente.email,  
                from_name: usuarioRemitente.nombreUsuario || 'Administrador',
                asunto: `Reserva ${accion}`,
                nombre: reservaSeleccionadaLocal.usuario,
                idReserva: reservaSeleccionadaLocal.idReserva,
                salon: reservaSeleccionadaLocal.salon,
                fechaReserva: reservaSeleccionadaLocal.fechaReserva,
                horaInicio: reservaSeleccionadaLocal.horaInicio,
                horaFin: reservaSeleccionadaLocal.horaFin,
                observaciones: motivoEnviado,
                mensajeAdicional: mensajeAdicional,
                accion: accion === 'aprobada' ? 'aprobada' : accion === 'rechazada' ? 'rechazada' : 'cancelada',
            };

            console.log("📨 DATOS DEL CORREO A ENVIAR:", datosCorreo);
            
            this.emailService.enviarCorreo(datosCorreo).then(
                () => {
                    this.messageService.add({ severity: 'success', summary: 'Correo enviado con éxito' });
                },
                (error) => {
                    console.error('❌ Error al enviar el correo:', error);
                }
            );
        },
        error: (err) => {
            console.error('❌ Error al consultar el usuario autenticado:', err);
        }
    });
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
  
  cancelarReserva(reserva: any): void {
    if (!reserva || !reserva.idReserva) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Datos insuficientes',
        detail: 'No se puede cancelar esta reserva porque faltan datos.',
      });
      return;
    }
  
    // Configurar el modal para la acción de cancelar
    this.accion = 'cancelar';
    this.reservaSeleccionada = reserva;
    this.mostrarModalMotivo = true;
    this.motivo = ''; // Inicia con un motivo vacío
  }
  
  private obtenerDatosUsuario(): any {
    const esEstudiante = window.location.pathname.includes("login-student");

    const usuarioData = localStorage.getItem(
        esEstudiante ? 'usuarioDataEstudiante' : 'usuarioDataAdministrativo'
    );

    if (!usuarioData) {
        console.warn("⚠ No hay datos en localStorage para el usuario actual");
        return null;
    }

    return JSON.parse(usuarioData);
  }

  
}
