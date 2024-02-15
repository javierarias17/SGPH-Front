export class FiltroUsuarioDTO{
	
	public nombre: string;

	public numeroIdentificacion: string;

	public estado: boolean;

	public pagina:number;

	public registrosPorPagina:number;

	constructor(){	
		this.nombre= "";
		this.numeroIdentificacion=null;
		this.estado=null;
	} 
}