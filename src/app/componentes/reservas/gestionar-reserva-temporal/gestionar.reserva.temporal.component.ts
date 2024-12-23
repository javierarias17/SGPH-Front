import { Component } from '@angular/core';
import { ReservaTemporalService } from '../../common/services/reserva.temporal.service';
import { FiltroEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/in/filtro.espacio.fisico.dto';
import { UbicacionOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { FranjaLibreOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/franaja.libre.out.dto';
import { HorarioService } from '../../common/services/horario.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { EspacioFisicoService } from '../../common/services/espacio.fisico.service';

@Component({
  selector: 'app-gestionar-reserva-temporal',
  templateUrl: './gestionar.reserva.temporal.component.html',
  styleUrls: ['./gestionar.reserva.temporal.component.css']
})
export class GestionarReservaTemporalComponent {
  usuario: any = null;
  facultades: any[] = [];
  edificios: any[] = [];
  espaciosFisicos: any[] = [];
  aulas: any[] = [];
  espaciosDisponibles: any[] = [];
  espaciosReservados: any[] = [];
  fechaSolicitud = new Date();
  fechaUso: Date | null = null;
  horaInicio: Date | null = null;
  horaFin: Date | null = null;
  justificacion: string = '';
  
  public filtro: any = {
    idEspacioFiso: null,
    idUbicacion: null,
    salon: '',
    nombre: '',
    dia: '',
    horaInicio: '',
    horaFin: '',
  };

  public filtroEspacioFisicoDTO: FiltroEspacioFisicoDTO=new FiltroEspacioFisicoDTO();
  public lstUbicacionOutDTO: UbicacionOutDTO[] = []; // Lista de ubicaciones
  public franjasLibres: FranjaLibreOutDTO[] = [];
  public franjasFiltradas: any[] = [];
  public loading: boolean = false;


  constructor(private reservaService: ReservaTemporalService,
    private horarioService: HorarioService,
    private espacioFisicoService: EspacioFisicoService,
    private sharedService: SharedService, 
    private messageService: ShowMessageService
  ) {}

  ngOnInit(): void {
    this.cargarUbicaciones();
    this.buscarFranja();
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.reservaService.cargarFormulario('andresfag').subscribe((data) => {
      this.usuario = data.usuario;
    });
  }

  cargarUbicaciones(): void {
    this.espacioFisicoService.consultarUbicaciones().subscribe(
      (ubicaciones) => {
        this.lstUbicacionOutDTO = ubicaciones;
      },
      (error) => console.error('Error al cargar ubicaciones', error)
    );
  }

  onInputsChange(): void {
    this.buscarFranja();
  }

  buscarFranja(): void {
    const formatTime = (timeValue: Date | string): string | null => {
      if (!timeValue) return null;
      if (typeof timeValue === 'string') {
        const parts = timeValue.trim().split(':');
        if (parts.length === 2) {
          return `${parts[0]}:${parts[1]}:00`;
        } else {
          return null; 
        }
      } else {
        const hours = timeValue.getHours().toString().padStart(2, '0');
        const minutes = timeValue.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
      }
    }; 

    // Función para convertir el día de la semana a texto
    const getDayName = (date: Date): string => {
      const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
      return days[date.getDay()];
    };

    const REGISTROS_POR_PAGINA_SIN_PAGINACION = 300;
    const diaSeleccionado = this.fechaUso ? getDayName(this.fechaUso) : null;
    const filtro = {
      pagina: 0, 
      registrosPorPagina: REGISTROS_POR_PAGINA_SIN_PAGINACION,
      fechaUso: this.fechaUso,
      dia: diaSeleccionado, 
      horaInicio: formatTime(this.filtro.horaInicio),
      horaFin: formatTime(this.filtro.horaFin),
      idUbicacion: this.filtro.idUbicacion,
      salon: this.filtro.salon?.trim() || '',
    };

    this.horarioService.consultarFranjasLibres(filtro).subscribe({
      next: (data) => {
        this.espaciosDisponibles = data.content.map((franja: any) => ({
          label: `${franja.salon} - ${franja.dia} (${franja.horaInicio} - ${franja.horaFin})`,
          value: franja.idEspacioFisico,
        }));
        console.log("ESPACIOSDISPONI", this.espaciosDisponibles);
      },
      error: (error) => {
        console.error('Error al consultar franjas libres:', error);
        this.messageService.showMessage('error', 'No se pudieron cargar las franjas libres');
      },
    });
  }

  reservar(): void {
    console.log("ENTRA")
    if (!this.usuario) {
      this.messageService.showMessage('error', 'No se encontró información del usuario.');
      return;
    }
    console.log("ENTRA2")
    if (!this.fechaUso || !this.filtro.horaInicio || !this.filtro.horaFin) {
      this.messageService.showMessage('error', 'Debe completar la fecha, hora de inicio y hora de fin.');
      return;
    }
    console.log("ENTRA3")
    // Construir el objeto para enviar al backend
    const reserva = {
      idEspacioFisico: this.espaciosReservados.length > 0 ? this.espaciosReservados[0].value : null,
      salon: this.filtro.salon,
      idUbicacion: this.filtroEspacioFisicoDTO.listaIdUbicacion,
      usuario: this.usuario.usuario, // Campo del usuario cargado
      correo: this.usuario.correo,   // Campo del usuario cargado
      tipoIdentificacion: this.usuario.tipoIdentificacion,
      identificacion: this.usuario.identificacion,
      tipoSolicitante: this.usuario.programa[0]?.rol, // Tipo de solicitante
      fechaReserva: this.fechaUso.toISOString().split('T')[0], // Convertir a formato YYYY-MM-DD
      estado: 'RESERVA_PENDIENTE', // Estado inicial de la reserva
      observaciones: this.justificacion, // Justificación del uso
      horaInicio: this.filtro.horaInicio,
      horaFin: this.filtro.horaFin,
      dia: this.getDayName(this.fechaUso), // Día de la semana en texto
    };
    console.log("ENTRA4")
    // Llamar al servicio
    this.loading = true;
    this.reservaService.guardarReserva(reserva).subscribe({
      
      next: (response) => {
        console.log("ENTRA5");
        this.messageService.showMessage('success', 'Reserva realizada exitosamente.');
        console.log('Respuesta del backend:', response);
        this.resetFormulario(); // Opcional: Reiniciar el formulario tras la reserva
      },
      error: (error) => {
        console.error('Error al realizar la reserva:', error);
        this.messageService.showMessage('error', 'No se pudo realizar la reserva.');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  
  private getDayName(date: Date): string {
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    return days[date.getDay()];
  }
  
  private resetFormulario(): void {
    this.fechaUso = null;
    this.filtro.horaInicio = '';
    this.filtro.horaFin = '';
    this.justificacion = '';
    this.espaciosReservados = [];
  }  

  onUbicacionesChange(): void {
    console.log('Ubicación seleccionada:', this.filtroEspacioFisicoDTO.listaIdUbicacion);
    this.filtro.idUbicacion = this.filtroEspacioFisicoDTO.listaIdUbicacion;  
    this.buscarFranja();
  }

  onFechaUsoChange(): void {
    console.log("Fecha seleccionada:", this.fechaUso);
    this.buscarFranja(); // Actualizar la búsqueda cuando cambie la fecha
  }
}
