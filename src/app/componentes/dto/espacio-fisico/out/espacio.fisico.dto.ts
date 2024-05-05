import { EstadoEspacioFisicoEnum } from "../../../enum/estado.espacio.fisico.enum";

export class EspacioFisicoDTO{    
	public idEspacioFisico: number;
	public capacidad: number;
	public estado: EstadoEspacioFisicoEnum;
	public salon: string;
	public edificio:string;
	public ubicacion:string;
	public tipoEspacioFisico: string;
}