import { EstadoEspacioFisicoEnum } from "../../../../common/enum/estado.espacio.fisico.enum";

export class FiltroEspacioFisicoDTO{
	
	public listaIdUbicacion: number[];

	public listaIdEdificio: number[];

	public listaIdTipoEspacioFisico: number[];

	public numeroEspacioFisico: string;

	public estado: EstadoEspacioFisicoEnum;
	
	public capacidad: number;

	public pagina:number;

	public registrosPorPagina:number;
	
	public salon: string;
	
	constructor(){
		this.listaIdUbicacion= [];
		this.listaIdTipoEspacioFisico =[];
	} 
}