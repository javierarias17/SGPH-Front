import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiaSemanaEnum } from 'src/app/componentes/common/enum/dia.semana.enum';
import { FranjaHorariaEspacioFisicoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/franja.horaria.espacio.fisico.dto';
import { PlanificacionManualService } from 'src/app/componentes/common/services/planificacion.manual.service';
import { SpinnerService } from 'src/app/shared/service/spinner.service';
import { EspacioFisicoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/espacio.fisico.dto';
import { EspacioFisicoService } from 'src/app/componentes/common/services/espacio.fisico.service';
import { EstadoEspacioFisicoEnum } from 'src/app/componentes/common/enum/estado.espacio.fisico.enum';

@Component({
  selector: 'app-visualizar-espacio-fisico',
  templateUrl: './visualizar.espacio.fisico.component.html',
  styleUrls: ['./visualizar.espacio.fisico.component.css'],
})
export class VisualizarEspacioFisicoComponent implements OnInit {
  public espacioFisicoId: number | null = null;
  public espacioFisicoDTOSeleccionado: EspacioFisicoDTO = {} as EspacioFisicoDTO;
  public listaFranjaHorariaAulaDTO: FranjaHorariaEspacioFisicoDTO[] = [];
  public horas: string[] = [];     // Para la lógica interna (formato "07:00:00")
public horasDisplay: string[] = [];  // Para mostrar en la interfaz ("07:00 - 08:00")

  public dias: DiaSemanaEnum[] = [
    DiaSemanaEnum.LUNES,
    DiaSemanaEnum.MARTES,
    DiaSemanaEnum.MIERCOLES,
    DiaSemanaEnum.JUEVES,
    DiaSemanaEnum.VIERNES,
    DiaSemanaEnum.SABADO,
    DiaSemanaEnum.DOMINGO,
  ];
  public posicionesOcupadas: { x: number; y: number }[] = [];
  public datosCargados = false;
  constructor(
    private route: ActivatedRoute,
    private planificacionManualService: PlanificacionManualService,
    private spinnerService: SpinnerService,
    private espacioFisicoService: EspacioFisicoService
  ) {
    for (let i = 7; i <= 21; i++) {
      // Hora en formato raw (para lógica interna)
      const horaRaw = i < 10 ? `0${i}:00:00` : `${i}:00:00`;
      this.horas.push(horaRaw);
      
      // Calcular la hora siguiente para el display
      const siguienteHora = i + 1;
      const siguienteHoraStr = siguienteHora < 10 ? `0${siguienteHora}:00` : `${siguienteHora}:00`;
      
      // Formato display: extraemos solo las horas y minutos de la hora raw y le concatenamos la siguiente hora
      this.horasDisplay.push(`${horaRaw.substring(0, 5)} - ${siguienteHoraStr}`);
    }
  }

  ngOnInit(): void {
    // Obtener el ID del espacio físico desde la URL
    this.espacioFisicoId = +this.route.snapshot.paramMap.get('idEspacioFisico')!;
    if (this.espacioFisicoId) {
      this.cargarHorario();
      this.cargarDetallesEspacioFisico();
    }
  }

  cargarHorario(): void {
    this.spinnerService.show('Cargando horario...');
    this.planificacionManualService
      .consultarFranjasEspacioFisicoPorIdEspacioFisico(this.espacioFisicoId!)
      .subscribe(
        (data: FranjaHorariaEspacioFisicoDTO[]) => {
          this.listaFranjaHorariaAulaDTO = data;
          this.datosCargados = true;
          this.spinnerService.hide();
        },
        (error) => {
          console.error('Error al cargar el horario:', error);
          this.spinnerService.hide();
        }
      );
  }

  obtenerNombreCurso(dia: DiaSemanaEnum, horaInicio: string): string {
    const franja = this.listaFranjaHorariaAulaDTO.find(
        (f) =>
          f.dia === dia &&
        horaInicio >= f.horaInicio.toString() &&
        horaInicio < f.horaFin.toString() // Asegúrate de que la hora actual esté dentro del rango
      );
      return franja ? franja.nombreCurso : '';
  }
  

  configurarBorderSegunIndicador(dia: DiaSemanaEnum, horaInicio: string): string {
    const franjaCurso = this.listaFranjaHorariaAulaDTO.find(
      (f) => f.dia === dia && f.horaInicio.toString() === horaInicio
    );
    return franjaCurso && !franjaCurso.esPrincipal ? '3px dashed #000' : null;
  }  

  obtenerColorPorMateria(materia: string): string {
    if (!materia) {
      return '#cccccc';
    }

    let hash = 0;
    for (let i = 0; i < materia.length; i++) {
      hash = materia.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 60%, 75%)`;
  }

  formatearHoraString(horaString: string): string {
    const [horas, minutos] = horaString.split(':');
    return `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`;
  }

  generarFilasParaFranja(dia: DiaSemanaEnum, horaInicio: string): string {
    const franja = this.listaFranjaHorariaAulaDTO.find(
      (f) => f.dia === dia && f.horaInicio.toString() === horaInicio
    );
  
    if (franja) {
      const horaInicioDate = new Date(`2000-01-01T${franja.horaInicio}`);
      const horaFinDate = new Date(`2000-01-01T${franja.horaFin}`);
  
      // Calcula el número de filas necesarias (cada fila equivale a 2 horas)
      const diffMs = horaFinDate.getTime() - horaInicioDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
  
      return `span ${diffHours / 2}`; // Divide entre 2 porque cada fila es de 2 horas
    }
  
    return 'span 1'; // Por defecto, una fila
  }
  
  cargarDetallesEspacioFisico(): void {
    if (!this.espacioFisicoId) {
      return;
    }
  
    this.spinnerService.show('Cargando datos del espacio físico...');
    this.espacioFisicoService
      .consultarEspacioFisicoPorIdEspacioFisico(this.espacioFisicoId)
      .subscribe(
        (data) => {
          // Mapear las propiedades del DTO
          this.espacioFisicoDTOSeleccionado = {
            idEspacioFisico: data.idEspacioFisico,
            capacidad: data.capacidad,
            estado: data.estado ? EstadoEspacioFisicoEnum.ACTIVO : EstadoEspacioFisicoEnum.INACTIVO, // Asegúrate de que coincidan los valores
            salon: data.salon,
            idEdificio: data.idEdificio,
            nombreEdificio: data.nombreEdificio,
            idUbicacion: data.idUbicacion,
            nombreUbicacion: data.nombreUbicacion,
            tipoEspacioFisico: data.nombreTipoEspacioFisico, // Corrige según la propiedad existente
            OID: data.oid, // Corrige la referencia según la propiedad correcta
          };
          
  
          this.spinnerService.hide();
        },
        (error) => {
          console.error('Error al cargar los detalles del espacio físico:', error);
          this.spinnerService.hide();
        }
      );
  }
  
  
}
