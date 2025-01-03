import { Component, Input } from '@angular/core';
import { FiltroEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/in/filtro.espacio.fisico.dto';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { EspacioFisicoService } from '../../common/services/espacio.fisico.service';
import { HorarioService } from '../../common/services/horario.service';
import { ReservaTemporalService } from '../../common/services/reserva.temporal.service';
import { FranjaLibreOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/franaja.libre.out.dto';
import { UbicacionOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { LoginComponent } from 'src/app/demo/components/auth/login/login.component';
import { LoginService } from '../../common/services/login.service';
import { UsuarioService } from '../../common/services/usuario.service';

@Component({
  selector: 'app-registrar-reserva-planificador',
  templateUrl: './registrar.reserva.planificador.component.html',
  styleUrls: ['./registrar.reserva.planificador.component.css']
})
export class RegistrarReservaPlanificadorComponent {
  @Input() mostrarDialogoReserva: boolean = false;

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
    messages: any[];
    
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
      private messageService: ShowMessageService,
      private usuarioService: UsuarioService,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.cargarUbicaciones();
      this.buscarFranja();
      this.cargarUsuario();
      console.log("estadoUsuario", this.cargarUsuarioPlanificador());
    }
  
    cargarUsuario(): void {
      this.reservaService.cargarFormulario('cristianestiben').subscribe((data) => {
        this.usuario = data.usuario;
      });
    }
  
    cargarUsuarioPlanificador():void{
        this.usuarioService.consultarEstadosUsuario();
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
  
      // 1. Definir el arreglo de nombres de días (índice 0 = DOMINGO, 1 = LUNES, etc.)
      const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    
      // Función auxiliar para formatear la fecha a 'yyyy-MM-dd'
      const formatDateYYYYMMDD = (dateValue: Date | null): string | null => {
        if (!dateValue) {
          return null;
        }
        const year = dateValue.getFullYear();
        const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
        const day = dateValue.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`; // '2024-12-27'
      };
    
      // Función para formatear horas (HH:mm:ss)
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
    
      const diaSeleccionado = this.obtenerDiaDeLaSemana(this.fechaUso);
    
      // Formateamos las fechas
      const fechaUsoFormateada = formatDateYYYYMMDD(this.fechaUso);
      const fechaReservaFormateada = formatDateYYYYMMDD(this.filtro.fechaReserva);
    
      // 3. Construir el filtro y asignar el día
      const filtro = {
        pagina: 0,
        registrosPorPagina: 300,
        fechaUso: fechaUsoFormateada,
        fechaReserva: fechaReservaFormateada,
        horaInicio: formatTime(this.filtro.horaInicio),
        horaFin: formatTime(this.filtro.horaFin),
        idUbicacion: this.filtro.idUbicacion,
        dia: diaSeleccionado, 
        salon: this.filtro.salon?.trim() || '',
      };
    
      console.log("BUSCAR FRANJAS DIA", filtro)
      // 4. Llamar al servicio con el filtro (que ahora lleva el día)
      this.reservaService.consultarFranjasLibres(filtro).subscribe({
        next: (data) => {
          this.espaciosDisponibles = data.content.map((franja: any) => ({
            label: `${franja.salon} (${franja.horaInicio} - ${franja.horaFin})`,
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
  
      const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
      let diaSeleccionado = null;
      if (this.filtro.fechaReserva instanceof Date) {
        // getDay() retorna un número (0=Domingo, 6=Sábado)
        const dayIndex = this.filtro.fechaReserva.getDay();
        diaSeleccionado = dayNames[dayIndex]; 
        console.log("DIA SELECCIONADO", diaSeleccionado);
      }    
      const reserva = {
        idEspacioFisico: this.espaciosReservados.length > 0 ? this.espaciosReservados[0].value : null,
        salon: this.filtro.salon,
        idUbicacion: this.filtroEspacioFisicoDTO.listaIdUbicacion,
        usuario: this.usuario.usuario, 
        correo: this.usuario.correo,   
        tipoIdentificacion: this.usuario.tipoIdentificacion,
        identificacion: this.usuario.identificacion,
        tipoSolicitante: this.usuario.programa[0]?.rol,
        fechaReserva: this.fechaUso ? this.fechaUso.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        estado: 'RESERVA_PENDIENTE', 
        observaciones: this.justificacion,
        horaInicio: this.filtro.horaInicio,
        horaFin: this.filtro.horaFin,
        dia: diaSeleccionado, 
      };
  
      console.log("fecha uso", reserva);
      /*if (!this.fechaUso || !this.filtro.horaInicio || !this.filtro.horaFin) {
        this.messageService.showMessage('error', 'Debe completar la fecha, hora de inicio y hora de fin.');
        return;
      }*/
      // Llamar al servicio
      this.loading = true;
      console.log("PARAMETRO RESERVA", reserva);
      this.reservaService.guardarReserva(reserva).subscribe({
        
        next: (response) => {
          console.log("ENTRA5");
          this.messageService.showMessage('success', 'Reserva realizada exitosamente.');
          this.router.navigate(['/reserva/InformacionReserva'])
          console.log('Respuesta del backend:', response);
          
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
  
    obtenerDiaDeLaSemana(fecha) {
      const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
      const date = new Date(fecha);
      return diasSemana[date.getDay()];
    }

    cerrarDialogo(): void {
        this.mostrarDialogoReserva = false;
      }
}
