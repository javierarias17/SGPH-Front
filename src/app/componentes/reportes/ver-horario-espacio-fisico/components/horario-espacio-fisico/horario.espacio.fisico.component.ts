import { Component, ViewChild } from '@angular/core';
import { DiaSemanaEnum } from 'src/app/componentes/common/enum/dia.semana.enum';
import { EspacioFisicoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/espacio.fisico.dto';
import { FranjaHorariaEspacioFisicoDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/franja.horaria.espacio.fisico.dto';
import { PlanificacionManualService } from 'src/app/componentes/common/services/planificacion.manual.service';
import { SpinnerService } from 'src/app/shared/service/spinner.service';

@Component({
  selector: 'app-horario-espacio-fisico',
  templateUrl: './horario.espacio.fisico.component.html',
  styleUrls: ['./horario.espacio.fisico.component.css'],
  providers: [PlanificacionManualService]
})
export class HorarioEspacioFisicoComponent {
	
	public mostrarModalError: boolean = false;
	public mensajeError: string = '';

	/*Configuración modal*/
	@ViewChild('horarioAula') horarioAula: HorarioEspacioFisicoComponent;

	public visible: boolean = false;

	public tituloModal: string = "Horario aula";
	
	public espacioFisicoDTOSeleccionado:EspacioFisicoDTO;
	
	public listaFranjaHorariaAulaDTO: FranjaHorariaEspacioFisicoDTO[] = [];
	
	// Arreglo para almacenar las posiciones ocupadas
	public posicionesOcupadas: { x: number, y: number }[] = [];

	public horas: string[] = [];  

	public dias: DiaSemanaEnum[] = [
		DiaSemanaEnum.LUNES,
		DiaSemanaEnum.MARTES,
		DiaSemanaEnum.MIERCOLES,
		DiaSemanaEnum.JUEVES,
		DiaSemanaEnum.VIERNES,
		DiaSemanaEnum.SABADO,
		DiaSemanaEnum.DOMINGO
	];
	
	constructor(private planificacionManualService: PlanificacionManualService, private spinnerService: SpinnerService){
		for (let i = 7; i <= 22; i++) {
			const hora = i < 10 ? `0${i}:00:00` : `${i}:00:00`;
			this.horas.push(hora);
		}
	}

	public abrirModal(espacioFisicoDTOSeleccionado:EspacioFisicoDTO):void {
		this.espacioFisicoDTOSeleccionado = espacioFisicoDTOSeleccionado;
		this.consultarAula();
	}

	public salir():void{
		this.visible=false;
	}  

	private consultarAula():void {
		this.posicionesOcupadas=[];
		this.listaFranjaHorariaAulaDTO = [];
		// Verificar si idEspacioFisico es válido y realizar la consulta
		if (this.espacioFisicoDTOSeleccionado.idEspacioFisico) {  		
			this.spinnerService.show("Consultando horario de espacio físico...");  
			this.planificacionManualService.consultarFranjasEspacioFisicoPorIdEspacioFisico(this.espacioFisicoDTOSeleccionado.idEspacioFisico).subscribe(
				(listaFranjaHorariaAulaDTO: FranjaHorariaEspacioFisicoDTO[]) => {
					this.listaFranjaHorariaAulaDTO = listaFranjaHorariaAulaDTO;
					this.spinnerService.hide();
					this.visible=true;
				},
				(error) => {
					this.spinnerService.hide();
					console.error(error);
					this.mensajeError = 'Ocurrió un error al consultar el horario del espacio físico.';
					this.mostrarModalError = true;
				}
			);
		}
	}

	public cerrarModalError() {
		this.mostrarModalError = false;
	}

	// Función para verificar si una posición está ocupada
	public esPosicionOcupada(x: number, y: number): boolean {
		return this.posicionesOcupadas.some(posicion => posicion.x === x && posicion.y === y);
	}

	// Función para agregar una posición al arreglo
	private agregarPosicion(x: number, y: number): void {
		this.posicionesOcupadas.push({ x, y });
	}
	
	private calcularFilasParaFranja(franja: FranjaHorariaEspacioFisicoDTO, hora: Date): number {
		const horaInicioDate = new Date(`2000-01-01T${franja.horaInicio}`);
		const horaFinDate = new Date(`2000-01-01T${franja.horaFin}`);
		const horaDate = new Date(`2000-01-01T${hora}`);

		const diffMs = horaFinDate.getTime() - horaInicioDate.getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMinutes / 60);

		return horaDate >= horaInicioDate && horaDate < horaFinDate ? diffHours : 1;
	}

	public generarFilasParaFranja(dia: DiaSemanaEnum, hora: Date): string {
		const franja = this.listaFranjaHorariaAulaDTO.find(f => f.dia === dia && f.horaInicio === hora);

		if (franja) {
			const filas = this.calcularFilasParaFranja(franja, hora);
			return `span ${filas}`;
		}
		return 'span 1'; 
	}	

	public obtenerNombreCurso(dia: DiaSemanaEnum, horaInicio: Date): string {
		const franja = this.listaFranjaHorariaAulaDTO.find(
		(f) => f.horaInicio === horaInicio && f.dia === dia
		);
		return franja ? franja.nombreCurso : '';
	}

	public configurarFranjaCurso(dia: DiaSemanaEnum, horaInicio: Date, fila:number, columna:number): string {
		const franjaCurso = this.listaFranjaHorariaAulaDTO.find(f => f.dia === dia && f.horaInicio === horaInicio);
		
		if(franjaCurso){
			const posiciones = this.calcularFilasParaFranja(franjaCurso, horaInicio);
			for (let i = 1; i <= posiciones-1; i++) {
				this.agregarPosicion(fila+i,columna);
			}
		}
		return franjaCurso ? franjaCurso.nombreCurso : '';
	}

	public configurarBorderSegunIndicador(dia: DiaSemanaEnum, horaInicio: Date): string {
		const franjaCurso = this.listaFranjaHorariaAulaDTO.find(f => f.dia === dia && f.horaInicio === horaInicio);
		if(franjaCurso && franjaCurso.esPrincipal===false){
			return '3px dashed #000';
		}
		return null;
	}

	public obtenerColorPorMateria(materia: string): string {
		const colorBase = this.stringToHslColor(materia);
		return colorBase;
	}

	// Función para convertir una cadena en un color HSL
	public  stringToHslColor(str: string): string {
		if (!str) {
			// Si la cadena es undefined o null, retornar un color por defecto o manejarlo según tus necesidades
			return '#cccccc'; // Color gris por defecto
		}

		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}

		const hue = hash % 360;
		const lightness = 75;
		const saturation = 60;

		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	}

	public formatearHoraString(horaString):string {
		// Dividir la cadena en horas, minutos y segundos
		const [horas, minutos, segundos] = horaString.split(':');

		// Formatear las horas y los minutos
		const horasFormateadas = horas.padStart(2, '0');
		const minutosFormateados = minutos.padStart(2, '0');

		// Crear la cadena formateada
		const horaFormateada = `${horasFormateadas}:${minutosFormateados}`;

		return horaFormateada;
	}
}
