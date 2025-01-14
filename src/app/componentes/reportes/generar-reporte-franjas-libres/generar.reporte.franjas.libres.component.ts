import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../../common/services/horario.service';
import { FranjaLibreOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/franaja.libre.out.dto';
import { EspacioFisicoService } from '../../common/services/espacio.fisico.service';
import { Message, MessageService } from 'primeng/api';
import { UbicacionOutDTO } from '../../datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { FiltroEspacioFisicoDTO } from '../../datos/gestionar-espacio-fisico/model/in/filtro.espacio.fisico.dto';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';

@Component({
  selector: 'app-generar-reporte-franjas-libres',
  templateUrl: './generar.reporte.franjas.libres.component.html',
  styleUrls: ['./generar.reporte.franjas.libres.component.css'],
})
export class GenerarReporteFranjasLibresComponent implements OnInit {
  private readonly PAGINA_CERO: number = 0;
  private readonly REGISTROS_POR_PAGINA: number = 10;

  // Variables de paginación
  public paginaActual: number = this.PAGINA_CERO;
  public registrosPorPagina: number = this.REGISTROS_POR_PAGINA;
  public totalRecords: number = 0;
  public pagina: number = this.PAGINA_CERO;
  public messages: Message[] = null;

  // Lista de días de la semana
  public diasSemana: any[] = [
    { label: 'Seleccione el día', value: null },
    { label: 'Lunes', value: 'LUNES' },
    { label: 'Martes', value: 'MARTES' },
    { label: 'Miércoles', value: 'MIERCOLES' },
    { label: 'Jueves', value: 'JUEVES' },
    { label: 'Viernes', value: 'VIERNES' },
    { label: 'Sábado', value: 'SABADO' },
    { label: 'Domingo', value: 'DOMINGO' }
  ];

  // Filtros
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

  constructor(
    private horarioService: HorarioService,
    private espacioFisicoService: EspacioFisicoService,
    private sharedService: SharedService, 
    private messageService: ShowMessageService
  ) {}

  ngOnInit(): void {
    this.cargarUbicaciones();
    this.cargarFranjasLibres();
    this.actualizarHoraFin();
  }

  cargarUbicaciones(): void {
    this.espacioFisicoService.consultarUbicaciones().subscribe(
      (ubicaciones) => {
        this.lstUbicacionOutDTO = ubicaciones;
      },
      (error) => console.error('Error al cargar ubicaciones', error)
    );
  }

  cargarFranjasLibres(resetPagina: boolean = false): void {
    // Reiniciar página si es un filtro nuevo
    if (resetPagina) {
      this.paginaActual = this.PAGINA_CERO;
    }
  
    console.log('Filtro actual:', this.filtro); // Validar filtros antes de enviar
  
    // Formatear horaInicio y horaFin si son objetos Date
    const formatTime = (timeValue: Date | string): string | null => {
      if (!timeValue) return null;
      if (typeof timeValue === 'string') {
        // Asumiendo que el input es "HH:mm"
        const parts = timeValue.trim().split(':');
        // Asegurarte de que tengas al menos horas y minutos
        if (parts.length === 2) {
          return `${parts[0]}:${parts[1]}:00`; // Agregar segundos
        } else {
          return null; 
        }
      } else {
        const hours = timeValue.getHours().toString().padStart(2, '0');
        const minutes = timeValue.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
      }
    }; 
    
    const filtroConPaginacion = {
      // Solo enviar página si no es un filtro nuevo
      pagina: resetPagina ? this.PAGINA_CERO : this.paginaActual,
      registrosPorPagina: this.registrosPorPagina,
      idUbicacion: this.filtro.idUbicacion,
      salon: this.filtro.salon?.trim() || '',
      nombre: this.filtro.nombre?.trim() || '',
      dia: this.filtro.dia,
      horaInicio: formatTime(this.filtro.horaInicio),
      horaFin: formatTime(this.filtro.horaFin),
    };
  
    this.loading = true;
  
    this.horarioService.consultarFranjasLibres(filtroConPaginacion).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        this.franjasLibres = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar franjas libres', error);
        this.loading = false;
      }
    );
  }
  
  cargarFranjasLibresSinPaginacion(): Promise<FranjaLibreOutDTO[]> {
    // Formatear horaInicio y horaFin si son objetos Date
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

    // Definir una cantidad alta para registrosPorPagina para intentar obtener todos los registros
    const REGISTROS_POR_PAGINA_SIN_PAGINACION = 1000000;

    const filtroSinPaginacion = {
      pagina: 0, 
      registrosPorPagina: REGISTROS_POR_PAGINA_SIN_PAGINACION,
      idUbicacion: this.filtro.idUbicacion,
      salon: this.filtro.salon?.trim() || '',
      nombre: this.filtro.nombre?.trim() || '',
      dia: this.filtro.dia,
      horaInicio: formatTime(this.filtro.horaInicio),
      horaFin: formatTime(this.filtro.horaFin),
    };

    return new Promise((resolve, reject) => {
      this.horarioService.consultarFranjasLibres(filtroSinPaginacion).subscribe(
        (response) => {
          resolve(response.content);
        },
        (error) => {
          console.error('Error al cargar todas las franjas libres', error);
          reject(error);
        }
      );
    });
  }

  onUbicacionesChange(): void {
    this.filtro.idUbicacion = this.filtroEspacioFisicoDTO.listaIdUbicacion;  
    this.paginaActual = this.PAGINA_CERO; // Resetear página
    this.cargarFranjasLibres();
  }

  onInputsChange(): void {
    this.cargarFranjasLibres();
  }

  onPageChange(event: any): void {
    this.paginaActual = event.page;
    this.registrosPorPagina = event.rows;
    this.cargarFranjasLibres();
  }
  
  async descargarReporte(): Promise<void> {
    try {
      this.loading = true;
      const todasLasFranjas = await this.cargarFranjasLibresSinPaginacion();
      
      if (todasLasFranjas.length === 0) {
        console.warn('No hay franjas libres para descargar.');
        this.loading = false;
        return;
      }
      
      this.sharedService.descargarHorarioFranjasLibres(todasLasFranjas).subscribe(
        (response) => {
          try {
            const jsonResponse = JSON.parse(response);
            if (jsonResponse.archivoBase64) {
              this.descargarArchivo(jsonResponse.archivoBase64, 'Horario_Franjas_Libres.xlsx');
              this.messageService.showMessage("success", "El archivo se ha descargado correctamente");
              this.limpiarMessages();
            } else {
              console.error('No se recibió el archivo en la respuesta.');
            }
          } catch (error) {
            console.error('Error al decodificar la respuesta JSON:', error);
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error al descargar reporte de franjas libres', error);
          this.loading = false;
        }
      );
    } catch (error) {
      console.error('Error al obtener todas las franjas libres', error);
      this.loading = false;
    }
  }

  private limpiarMessages(): void {
    setTimeout(() => {
        this.messages = null;
    }, 3000); // Puedes ajustar el tiempo según sea necesario
  }

  private descargarArchivo(base64Data: string, nombreArchivo: string): void {
      const binaryData = atob(base64Data);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      window.URL.revokeObjectURL(url);
  }

  actualizarHoraFin(): void {
    if (this.filtro.horaInicio) {
      // Convertir la hora de inicio a un objeto Date
      const [hours, minutes] = this.filtro.horaInicio.split(':').map(Number);
      const horaInicioDate = new Date();
      horaInicioDate.setHours(hours, minutes, 0);
  
      // Incrementar 2 horas
      const horaFinDate = new Date(horaInicioDate);
      horaFinDate.setHours(horaInicioDate.getHours() + 2);
  
      // Formatear la hora de fin
      const horasFin = horaFinDate.getHours().toString().padStart(2, '0');
      const minutosFin = horaFinDate.getMinutes().toString().padStart(2, '0');
      this.filtro.horaFin = `${horasFin}:${minutosFin}`;
    } else {
      // Si no hay hora de inicio, limpiar la hora de fin
      this.filtro.horaFin = '';
    }
    this.onInputsChange();
  }
  
}
