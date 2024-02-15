import { DiaSemanaEnum } from "../../../enum/dia.semana.enum";

export class FranjaHorariaAulaDTO{
    
	public idAula:number;

	public dia:DiaSemanaEnum;

	public horaInicio:Date;

	public horaFin: Date;

	public nombreCurso:string;
}