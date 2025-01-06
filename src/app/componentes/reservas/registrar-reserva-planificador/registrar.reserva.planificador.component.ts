import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FiltroEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/in/filtro.espacio.fisico.dto';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { EspacioFisicoService } from '../../common/services/espacio.fisico.service';
import { HorarioService } from '../../common/services/horario.service';
import { ReservaTemporalService } from '../../common/services/reserva.temporal.service';
import { FranjaLibreOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/franaja.libre.out.dto';
import { UbicacionOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { UsuarioService } from '../../common/services/usuario.service';

@Component({
  selector: 'app-registrar-reserva-planificador',
  templateUrl: './registrar.reserva.planificador.component.html',
  styleUrls: ['./registrar.reserva.planificador.component.css']
})
export class RegistrarReservaPlanificadorComponent {
  @Input() mostrarDialogoReserva: boolean = false;
  @Output() reservaCreada = new EventEmitter<void>();

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
    desactivarMovimiento: boolean = false; 
    contarEventos: number = 0;
    public idUbicacion: number; 
    
    public filtro: any = {
      idEspacioFiso: null,
      idUbicacion: 11,
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
    
      // 4. Llamar al servicio con el filtro (que ahora lleva el día)
      this.reservaService.consultarFranjasLibres(filtro).subscribe({
        next: (data) => {
            console.log("FRANJAS DISPONIBLES", data)
          this.espaciosDisponibles = data.content.map((franja: any) => ({
            label: `${franja.salon} (${franja.horaInicio} - ${franja.horaFin})`,
            value: franja,
          }));
        },
        error: (error) => {
          console.error('Error al consultar franjas libres:', error);
          this.messageService.showMessage('error', 'No se pudieron cargar las franjas libres');
        },
      });
    }  
  
    reservar(): void {
      if (!this.validarHorarios()) {
        this.messageService.showMessage('error', 'La hora fin debe ser mayor a la hora inicio.');
        return;
      }
    
      if (!this.validarFechaUso()) {
        this.messageService.showMessage('error', 'La fecha de reserva debe ser mayor o igual a la fecha actual.');
        return;
      }

        if (!this.validarCamposObligatorios()) {
          return; // No permitir la reserva si los campos no son válidos
        }
      
        if (!this.usuario) {
          this.messageService.showMessage('error', 'No se encontró información del usuario.');
          return;
        }
      
        const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        let diaSeleccionado = null;
        if (this.fechaUso instanceof Date) {
          const dayIndex = this.fechaUso.getDay();
          diaSeleccionado = dayNames[dayIndex];
        }
      
        // Ajustamos el valor para idEspacioFisico como explícitamente solicitado
        const reserva = {
          idEspacioFisico: this.espaciosReservados.length > 0 
            ? this.espaciosReservados[0].value.idEspacioFisico 
            : null, // Si no hay espacio reservado, dejamos null
          salon: this.filtro.salon,
          idUbicacion: this.filtro.idUbicacion,
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
      
        this.loading = true;
        this.reservaService.guardarReserva(reserva).subscribe({
          next: () => {
            this.messageService.showMessage('success', 'Reserva realizada exitosamente.');
            this.reservaCreada.emit();
            this.cerrarDialogo();
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

    cargarUsuario(): void {
        const usuarioData = this.obtenerDatosUsuario();
    
        if (usuarioData?.nombreUsuario) {
            this.reservaService.cargarFormulario(usuarioData.nombreUsuario).subscribe({
                next: (data) => {
                    this.usuario = data.usuario;
                    console.log('Usuario cargado:', this.usuario);
                },
                error: (err) => {
                    console.error('Error al cargar el formulario:', err);
                },
            });
        } else {
            console.error('No se encontró información del usuario para cargar el formulario.');
        }
    }    
    
    private obtenerDatosUsuario(): any {
        // Obtener los datos del usuario desde el localStorage
        const usuarioData = localStorage.getItem('usuarioData');
        return usuarioData ? JSON.parse(usuarioData) : null;
    }
    
      
    manejarMovimiento(event: any): void {
      // Si se intenta mover más de un elemento al mismo tiempo
      this.contarEventos = this.contarEventos+1;
      console.log("ITEMS EVENT", this.contarEventos);
      console.log("QUE TIENE EVENT TO", event.target);

      if (this.espaciosReservados.includes(event.items[0])) {
        console.log("Movimiento hacia ESPACIOS RESERVADOS");
        if(this.espaciosReservados.length === 1){
          // Movimiento válido: actualizar filtros con el elemento movido
          const itemMovido = event.items[0]; // Tomar el único elemento movido
          this.actualizarFiltrosConEspacioReservado(itemMovido);
        }
        if(this.contarEventos > 1){
          this.messageService.showMessage('error', 'No se puede reservar mas de un espacio.');
          this.contarEventos = 0;
          this.limpiarEspacioReservado();
        }
      }
      if (this.espaciosDisponibles.includes(event.items[0])) {
        console.log("Movimiento hacia ESPACIOS DISPONIBLES");
        this.limpiarEspacioReservado();
        
      } 
      
  
    }
    
    actualizarFiltrosConEspacioReservado(itemMovido: any): void {
      const espacio = itemMovido.value;
      this.filtro.salon = espacio.salon;
      this.filtro.horaInicio = espacio.horaInicio;
      this.filtro.horaFin = espacio.horaFin;
      this.filtro.idEspacioFisico = espacio.idEspacioFisico;
    
      console.log('Filtros actualizados:', this.filtro);
    }
    
    limpiarEspacioReservado(): void {
      // Limpiar la lista de reservados y habilitar los controles nuevamente
      this.espaciosReservados = [];
      this.desactivarMovimiento = false; // Reactivar el picklist
      this.limpiarFiltros();
    }
    
    limpiarFiltros(): void {
      // Limpiar los filtros asociados al espacio reservado
      this.filtro.salon = '';
      this.filtro.horaInicio = '';
      this.filtro.horaFin = '';
      this.filtro.idEspacioFisico = null;
      this.contarEventos = 0;
      console.log('Filtros limpiados');
    }
    
    
    moverEspacio(): void {
      if (this.espaciosDisponibles.length === 0) {
        this.messageService.showMessage('warn', 'No hay espacios disponibles para reservar.');
        return;
      }
    
      // Mueve el primer elemento disponible a la lista de reservados
      const espacioSeleccionado = this.espaciosDisponibles[0];
      this.espaciosReservados.push(espacioSeleccionado);
    
      // Actualiza los filtros
      this.filtro.salon = espacioSeleccionado.value.salon;
      this.filtro.horaInicio = espacioSeleccionado.value.horaInicio;
      this.filtro.horaFin = espacioSeleccionado.value.horaFin;
      this.filtro.idEspacioFisico = espacioSeleccionado.value.idEspacioFisico;
    
      // Elimina el espacio de la lista de disponibles
      this.espaciosDisponibles = this.espaciosDisponibles.filter(
        (espacio) => espacio !== espacioSeleccionado
      );
    }
    

    validarCamposObligatorios(): boolean {
        let camposValidos = true;
    
        if (!this.filtroEspacioFisicoDTO.listaIdUbicacion) {
            this.messageService.showMessage('error', 'La ubicación es obligatoria.');
            camposValidos = false;
        }
        if (!this.filtro.salon) {
            this.messageService.showMessage('error', 'El salón es obligatorio.');
            camposValidos = false;
        }
        if (!this.fechaUso) {
            this.messageService.showMessage('error', 'La fecha de uso es obligatoria.');
            camposValidos = false;
        }
        if (!this.filtro.horaInicio) {
            this.messageService.showMessage('error', 'La hora de inicio es obligatoria.');
            camposValidos = false;
        }
        if (!this.filtro.horaFin) {
            this.messageService.showMessage('error', 'La hora de fin es obligatoria.');
            camposValidos = false;
        }
    
        return camposValidos;
  }

  validarHorarios(): boolean {
    // Validar que ambos horarios existan
    if (!this.filtro.horaInicio || !this.filtro.horaFin) {
      return true; // No mostrar error si no se han ingresado ambos horarios
    }
  
    try {
      // Crear objetos Date con las horas
      const horaInicio = new Date(`1970-01-01T${this.filtro.horaInicio}`);
      const horaFin = new Date(`1970-01-01T${this.filtro.horaFin}`);
  
      // Validar que la hora de inicio sea menor a la hora de fin
      return horaFin > horaInicio;
    } catch (error) {
      console.error('Error al validar horarios:', error);
      return false; // Retornar falso si ocurre algún error en la validación
    }
  }
  
  
  validarFechaUso(): boolean {
    if (!this.fechaUso) {
      return false; // No validar si la fecha está vacía.
    }
  
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Limpiar horas para comparar solo fechas
    const fechaSeleccionada = new Date(this.fechaUso);
    fechaSeleccionada.setHours(0, 0, 0, 0);
  
    // Validar que la fecha de uso sea mayor o igual a la fecha actual
    return fechaSeleccionada >= hoy;
  }  
    
}

