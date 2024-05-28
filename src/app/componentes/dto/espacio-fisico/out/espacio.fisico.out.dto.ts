import { AgrupadorDTO } from "src/app/componentes/datos/gestionar-asignatura/model/agrupador-dto";
import { AgrupadorEspacioFiscioDTO } from "src/app/shared/model/AgrupadorEspacioFisicoDTO";

export class EspacioFisicoOutDTO{    
	public idEspacioFisico?:number;
	public capacidad?:number;
	public estado?: boolean;
	public numeroEspacioFisico?: string;
	public idEdificio?: number;
	public idTipoEspacioFisico?: number;

	OID?: string;
	salon?: string;
	edificio?: string;
	ubicacion?: string;
	municipio?: string;
	lstIdAgrupadorEspacioFisico?: AgrupadorDTO[]
	saveIdAgrupadores? : number []
}