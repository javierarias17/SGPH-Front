import { EstadoEspacioFisicoEnum } from "../../../enum/estado.espacio.fisico.enum";

export class FiltroEspacioFisicoDTO{
	
	public listaUbicacion: string[];

	public listaEdificio: string[];

	public listaIdTipoEspacioFisico: number[];

	public numeroEspacioFisico: string;

	public estado: EstadoEspacioFisicoEnum;
	
	public capacidad: number;

	public pagina:number;

	public registrosPorPagina:number;

	constructor(){
		this.listaUbicacion= [];
	} 
}