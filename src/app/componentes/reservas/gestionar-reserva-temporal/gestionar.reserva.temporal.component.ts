import { Component, Input } from '@angular/core';
import { ReservaTemporalService } from '../../common/services/reserva.temporal.service';
import { FiltroEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/in/filtro.espacio.fisico.dto';
import { UbicacionOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { FranjaLibreOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/franaja.libre.out.dto';
import { HorarioService } from '../../common/services/horario.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { EspacioFisicoService } from '../../common/services/espacio.fisico.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TokenService } from '../../common/services/token.service';
import { OAuthService } from 'angular-oauth2-oidc';

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
  espacioSeleccionado: any = null;
  fechaSolicitud = new Date();
  fechaUso: Date | null = null;
  horaInicio: Date | null = null;
  horaFin: Date | null = null;
  justificacion: string = '';
  messages: any[];
  desactivarMovimiento: boolean = false; 
  contarEventos: number = 0;
  public mostrarErrores: boolean = false;
  public idUbicacion: number; 
  public listaRecursos: Array<{ idRecursoFisico: number; nombre: string }> = [];
  public filtro: any = {
    idEspacioFiso: null,
    idUbicacion: 11,
    salon: '',
    nombre: '',
    dia: '',
    horaInicio: '',
    horaFin: '',
    listaRecursos: [] as number[]
  };

  public filtroEspacioFisicoDTO: FiltroEspacioFisicoDTO=new FiltroEspacioFisicoDTO();
  public lstUbicacionOutDTO: UbicacionOutDTO[] = []; // Lista de ubicaciones
  public franjasLibres: FranjaLibreOutDTO[] = [];
  public franjasFiltradas: any[] = [];
  public loading: boolean = false;


  constructor(private reservaService: ReservaTemporalService,
    private espacioFisicoService: EspacioFisicoService,
    private confirmationService: ConfirmationService,
    private messageService: ShowMessageService,
    private router: Router,
    private tokenService: TokenService,
    private oauthService: OAuthService
  ) {}

  ngOnInit(): void {
    this.cargarUbicaciones();
    this.buscarFranja();
    this.cargarUsuario();
    this.cargarRecursos();
    
  }

  onRecursoChange(event: any, idRecurso: number) {
    if (event.target.checked) {
      // Agregar ID si no está
      if (!this.filtro.listaRecursos.includes(idRecurso)) {
        this.filtro.listaRecursos.push(idRecurso);
        this.buscarFranja();
      }
    } else {
      // Quitar ID
      this.filtro.listaRecursos = this.filtro.listaRecursos.filter(id => id !== idRecurso);
      this.buscarFranja();
    }
    console.log('listaRecursos ahora:', this.filtro.listaRecursos);
  }
  
  cargarRecursos(): void {
    this.espacioFisicoService.obtenerListaRecursos().subscribe({
      next: (data) => {
        // Ver en consola los datos crudos
        console.log('Recursos desde backend:', data);
  
        this.listaRecursos = data.map((item: any) => ({
          idRecursoFisico: item.idRecurso, // forzamos a número con +
          nombre: item.nombre
        }));
        console.log('listaRecursos final:', this.listaRecursos);
      },
      error: (error) => {
        console.error('Error al cargar recursos', error);
      }
    });
  }    

  trackByRecurso(index: number, recurso: { idRecursoFisico: number; nombre: string }) {
    return recurso.idRecursoFisico; 
  }  

  cargarUsuario(): void {
    this.reservaService.cargarFormulario('juliethhs').subscribe((data) => {
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
  
    // 3. Construir el filtro y asignar el día
    const filtro = {
      pagina: 0,
      registrosPorPagina: 300,
      fechaUso: fechaUsoFormateada,
      fechaReserva: fechaUsoFormateada,
      horaInicio: formatTime(this.filtro.horaInicio),
      horaFin: formatTime(this.filtro.horaFin),
      idUbicacion: this.filtro.idUbicacion,
      dia: diaSeleccionado, 
      salon: this.filtro.salon?.trim() || '',
      listaRecursos: this.filtro.listaRecursos,
    };

    // 4. Llamar al servicio con el filtro (que ahora lleva el día)
    this.reservaService.consultarFranjasLibres(filtro).subscribe({
      next: (data) => {
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
    this.mostrarErrores = true; 
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

    // Mostrar confirmación antes de realizar la reserva
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea realizar la reserva?',
      header: 'Confirmar Reserva',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.realizarReserva(); // Llamar al método que realiza la reserva
      },
      reject: () => {
        this.messageService.showMessage('info', 'Reserva cancelada.');
      },
    });
  }
  
  realizarReserva(): void {
    this.validarCamposObligatorios()
    const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    let diaSeleccionado = null;
    if (this.fechaUso instanceof Date) {
      const dayIndex = this.fechaUso.getDay();
      diaSeleccionado = dayNames[dayIndex];
    }

    const reserva = {
      idEspacioFisico: this.espaciosReservados.length > 0 
        ? this.espaciosReservados[0].value.idEspacioFisico 
        : null,
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
      listaRecursos: this.filtro.listaRecursos,
    };

    this.loading = true;
    this.reservaService.guardarReserva(reserva).subscribe({
      next: () => {
        this.messageService.showMessage('success', 'Reserva realizada exitosamente.');
        this.router.navigate(['/reserva/InformacionReserva']);
      },
      error: (error) => {
        this.messageService.showMessage('error', error.error.message);
        this.espaciosReservados = [];
        this.buscarFranja();
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
    this.horaFin = null;
    this.horaInicio = null;
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

  // Seleccionar un espacio de los disponibles
  seleccionarEspacio(espacio: any): void {
    this.espacioSeleccionado = espacio;
  }

  // Seleccionar un espacio de los reservados
  seleccionarEspacioReservado(espacio: any): void {
    this.espacioSeleccionado = espacio;
  }

  // Reservar espacio
  reservarEspacio(): void {
    if (!this.puedeReservar()) {
      this.messageService.showMessage('error', 'Solo se pueden reservar franjas continuas del mismo salón.');
      return;
    }

    if (!this.espacioSeleccionado || this.espaciosReservados.includes(this.espacioSeleccionado)) {
      this.messageService.showMessage('warn', 'Seleccione un espacio disponible para reservar.');
      return;
    }
  
    const nuevoEspacio = this.espacioSeleccionado.value;
  
    // Validar que el salón sea el mismo para todas las franjas
    if (this.espaciosReservados.length > 0) {
      const primerEspacio = this.espaciosReservados[0].value;
  
      if (nuevoEspacio.salon !== primerEspacio.salon) {
        this.messageService.showMessage('error', 'Solo se pueden reservar franjas del mismo salón.');
        return;
      }
    }
  
    // Agregar el nuevo espacio a la lista de reservados
    this.espaciosReservados.push(this.espacioSeleccionado);
  
    this.filtro.salon = nuevoEspacio.salon;

    // Actualizar filtro de horaInicio y horaFin
    const horas = this.espaciosReservados.map((espacio) => ({
      inicio: espacio.value.horaInicio,
      fin: espacio.value.horaFin,
    }));
  
    // Ordenar las horas para determinar el rango
    horas.sort((a, b) => new Date(`1970-01-01T${a.inicio}`).getTime() - new Date(`1970-01-01T${b.inicio}`).getTime());
  
    this.filtro.horaInicio = horas[0].inicio; // La hora más temprana
    this.filtro.horaFin = horas[horas.length - 1].fin; // La hora más tardía
  
    // Eliminar la franja de la lista de disponibles
    this.espaciosDisponibles = this.espaciosDisponibles.filter(
      (espacio) => espacio !== this.espacioSeleccionado
    );
    this.espacioSeleccionado = null; // Limpiar selección

    this.buscarFranja();
  }

  // Quitar reserva
  quitarEspacio(): void {
    if (!this.espacioSeleccionado || this.espaciosDisponibles.includes(this.espacioSeleccionado)) {
      this.messageService.showMessage('warn', 'Seleccione un espacio reservado para quitar.');
      return;
    }
  
    // Mover espacio a la lista de disponibles
    this.espaciosDisponibles.push(this.espacioSeleccionado);
    this.espaciosReservados = this.espaciosReservados.filter(
      (espacio) => espacio !== this.espacioSeleccionado
    );
  
    // Recalcular el rango de horas si quedan franjas reservadas
    if (this.espaciosReservados.length > 0) {
      const horas = this.espaciosReservados.map((espacio) => ({
        inicio: espacio.value.horaInicio,
        fin: espacio.value.horaFin,
      }));
  
      // Ordenar las horas para determinar el nuevo rango
      horas.sort((a, b) => new Date(`1970-01-01T${a.inicio}`).getTime() - new Date(`1970-01-01T${b.inicio}`).getTime());
  
      this.filtro.horaInicio = horas[0].inicio; // La hora más temprana
      this.filtro.horaFin = horas[horas.length - 1].fin; // La hora más tardía
    } else {
      // Si no hay franjas reservadas, limpiar los filtros
      this.filtro.horaInicio = '';
      this.filtro.horaFin = '';
    }
    this.espacioSeleccionado = null; // Limpiar selección
  }

  puedeReservarMultiples(): boolean {
    if (this.espaciosReservados.length <= 1) {
      // Si hay 0 o 1 espacios reservados, no hay conflicto
      return true;
    }
  
    // Obtener la primera franja para comparar
    const primerEspacio = this.espaciosReservados[0].value;
  
    // Validar que todos los espacios reservados sean del mismo salón y fecha
    return this.espaciosReservados.every((espacio) => 
      espacio.value.salon === primerEspacio.salon &&
      this.fechaUso === this.fechaUso // Comparar fechas
    );
  }
  
  puedeReservar(): boolean {
    if (!this.espacioSeleccionado) {
      return false; // Si no hay ningún espacio seleccionado, deshabilitar el botón
    }
  
    if (this.espaciosReservados.length === 0) {
      return true; // Si no hay franjas reservadas, permitir reservar cualquier espacio
    }
  
    // Verificar que el salón sea el mismo
    const primerEspacio = this.espaciosReservados[0].value;
    if (this.espacioSeleccionado.value.salon !== primerEspacio.salon) {
      return false; // Si el salón no coincide, deshabilitar      
    }
  
    // Ordenar las franjas reservadas por hora de inicio
    const horasReservadas = this.espaciosReservados.map((espacio) => espacio.value);
    horasReservadas.sort((a, b) =>
      new Date(`1970-01-01T${a.horaInicio}`).getTime() - new Date(`1970-01-01T${b.horaInicio}`).getTime()
    );
  
    // Obtener la última franja reservada
    const ultimaFranja = horasReservadas[horasReservadas.length - 1];
  
    // Validar continuidad estricta:
    // 1. La franja seleccionada debe comenzar inmediatamente después de la última franja reservada.
    // 2. Si la última franja termina a las 13:00 (1 PM), permitir una franja que comience a las 14:00 (2 PM).
    const esContinuo =
      this.espacioSeleccionado.value.horaInicio === ultimaFranja.horaFin || // Inmediatamente después
      (ultimaFranja.horaFin === '13:00:00' && this.espacioSeleccionado.value.horaInicio === '14:00:00'); // Excepción 1 PM - 2 PM
  
    return esContinuo;
  }

  cerrarSesion() {
    // Limpiar token y datos de sesión
    this.tokenService.logOut(); // Borra los datos almacenados
    sessionStorage.clear(); // Limpia toda la sesión
    localStorage.clear(); // Opcional: limpia el almacenamiento local si se usa

    // Cerrar sesión de Google
    this.oauthService.logOut();

    // Redirigir al inicio de sesión
    this.router.navigate(['/auth/login']);
  }
  
  onNombreEspacioChange(event: any): void {
    this.filtro.salon = event.target.value.trim(); // Captura el valor del input y lo asigna al filtro
    this.buscarFranja(); // Llama al método que actualiza las franjas libres
  }
  
}
