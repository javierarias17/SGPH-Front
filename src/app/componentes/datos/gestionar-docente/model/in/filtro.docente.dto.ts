import { EstadoDocenteEnum } from "src/app/componentes/common/enum/estado.docente.enum";

export class FiltroDocenteDTO{
	
	public nombre: string;

	public numeroIdentificacion: string;

	public codigo: string;

	public estado: EstadoDocenteEnum;

	public pagina:number;

	public registrosPorPagina:number;

	constructor(){	
		this.nombre= "";
		this.numeroIdentificacion=null;
		this.codigo=null;	
		this.estado=null;
	} 
}