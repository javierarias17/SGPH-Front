import { AgrupadorDTO } from "src/app/componentes/datos/gestionar-asignatura/model/agrupador-dto";
export class EspacioFisicoOutDTO{    
	public idEspacioFisico?:number;
	public capacidad?:number;
	public estado?: boolean;
	public numeroEspacioFisico?: string;
	public idEdificio?: number;
	public idTipoEspacioFisico?: number;
	public esValidar?: boolean;
	OID?: string;
	salon?: string;
	nombreEdificio?: string;
	idUbicacion?: number;
	nombreUbicacion?: string;
	nombreTipoEspacioFisico?: string;
	municipio?: string;
	lstIdAgrupadorEspacioFisico?: AgrupadorDTO[]
	saveIdAgrupadores? : number []
	recursos?: any
}