import { DiaSemanaEnum } from "../../../enum/dia.semana.enum";

export class FranjaHorariaEspacioFisicoDTO{
    
	public idEspacioFisico:number;

	public dia:DiaSemanaEnum;

	public horaInicio:Date;

	public horaFin: Date;

	public nombreCurso:string;

	public esPrincipal: boolean;
}