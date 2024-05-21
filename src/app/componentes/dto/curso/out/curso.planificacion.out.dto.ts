export class CursoPlanificacionOutDTO{
    
	public idCurso:number;

	public idAsignatura:number;

	public nombrePrograma:string;

	public semestre:number;

	public nombreAsignatura: string;

	public grupo:string;

	public horarios: string[];

	public docentes: string[];

	public horasAsignadas:number;
	
	public horasSemana:number;

	public cupo:number;
}