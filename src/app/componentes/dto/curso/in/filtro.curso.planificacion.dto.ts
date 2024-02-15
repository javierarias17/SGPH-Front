import { EstadoCursoHorarioEnum } from "../../../enum/estado.curso.horario.enum";

export class FiltroCursoPlanificacionDTO{
    public estadoCursoHorario: EstadoCursoHorarioEnum;
	
	public listaIdFacultad: number[];

	public listaIdPrograma: number[];

	public listaIdAsignatura: number[];

	public semestre:number;

	public pagina:number;

	public registrosPorPagina:number;
	
	public cantidadDocentes:number;

	constructor(){		
	} 
}