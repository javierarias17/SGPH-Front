import { DiaSemanaEnum } from "../../../enum/dia.semana.enum";


export class FiltroFranjaHorariaDisponibleCursoDTO{

	public idCurso: number;

	public idAsignatura: number;

	public horaInicio: string;

	public horaFin: string;

	public duracion: number;

	public listaIdUbicacion: number[];

	public listaDiaSemanaEnum: DiaSemanaEnum[];

	public listaIdAgrupadorEspacioFisico: number[];

	public listaIdTipoEspacioFisico: number[];

	public salon: string;

	public esPrincipal:boolean;
	
	constructor(){	
		this.listaIdUbicacion=[]; 
		this.listaIdTipoEspacioFisico=[];
		this.listaIdAgrupadorEspacioFisico=[];
	}
}