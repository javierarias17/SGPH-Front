import { DiaSemanaEnum } from "../../../enum/dia.semana.enum";


export class FiltroFranjaHorariaDisponibleCursoDTO{

	public idCurso: number;

	public horaInicio: string;

	public horaFin: string;

	public duracion: number;

	public listaUbicaciones: string[];

	public listaDiaSemanaEnum: DiaSemanaEnum[];

	public listaIdAgrupadorEspacioFisico: number[];

	public listaIdTipoEspacioFisico: number[];

	public salon: string;

	
	constructor(){	
		this.listaUbicaciones=[]; 
		this.listaIdTipoEspacioFisico=[];
		this.listaIdAgrupadorEspacioFisico=[];
	}
}