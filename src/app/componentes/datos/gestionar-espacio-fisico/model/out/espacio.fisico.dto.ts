import { EstadoEspacioFisicoEnum } from "../../../../common/enum/estado.espacio.fisico.enum";

export class EspacioFisicoDTO{    
	public idEspacioFisico: number;
	public capacidad: number;
	public estado: EstadoEspacioFisicoEnum;
	public salon: string;
	public idEdificio: number;
	public nombreEdificio:string;
	public idUbicacion:number;
	public nombreUbicacion:string;
	public tipoEspacioFisico: string;
	public OID: string;
}