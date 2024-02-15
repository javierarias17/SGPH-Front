export class FiltroDocenteDTO{
	
	public nombre: string;

	public numeroIdentificacion: string;

	public codigo: string;

	public estado: boolean;

	public pagina:number;

	public registrosPorPagina:number;

	constructor(){	
		this.nombre= "";
		this.numeroIdentificacion=null;
		this.codigo=null;	
		this.estado=null;
	} 
}