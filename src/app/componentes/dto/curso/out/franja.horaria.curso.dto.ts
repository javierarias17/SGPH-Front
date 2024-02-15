import { DiaSemanaEnum } from "../../../enum/dia.semana.enum";

export class FranjaHorariaCursoDTO{

	public idHorario: number;
    
	public idAula:number;

	public nombreCompletoAula:string;

	public abreviaturaFacultad:string;

	public nombreEdificio:string;

	public dia: DiaSemanaEnum;

	public horaInicio: string;

	public horaFin: string ;
}