import { DiaSemanaEnum } from "../../../../common/enum/dia.semana.enum";

export class FranjaHorariaCursoDTO{

	public idHorario: number;
    
	public idEspacioFisico:number;

	public dia: DiaSemanaEnum;
	
	public horaInicio: string;
	
	public horaFin: string ;
	
	public nombreCompletoEspacioFisico:string;
	
	public abreviaturaFacultad:string;
	
	public nombreEdificio:string;
}