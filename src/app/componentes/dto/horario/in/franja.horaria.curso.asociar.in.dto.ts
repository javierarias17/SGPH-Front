import { DiaSemanaEnum } from "../../../enum/dia.semana.enum";

export class FranjaHorariaCursoAsociarInDTO{

	public idHorario: number;
    
	public idEspacioFisico:number;

	public dia: DiaSemanaEnum;

	public horaInicio: string;

	public horaFin: string;
}