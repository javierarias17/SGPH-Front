import { DiaSemanaEnum } from "../../../../common/enum/dia.semana.enum";

export class FranjaHorariaDocenteDTO{
    
	public dia:DiaSemanaEnum;

	public horaInicio:Date;

	public horaFin: Date;

	public nombreCurso:string;

	public salon: string;

	public salonSecundario:string;
}