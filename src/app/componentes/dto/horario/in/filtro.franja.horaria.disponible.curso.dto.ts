import { DiaSemanaEnum } from "../../../enum/dia.semana.enum";


export class FiltroFranjaHorariaDisponibleCursoDTO{

	public idCurso: number;

	public horaInicio: string;

	public horaFin: string;

	public duracion: number;

	public listaDiaSemanaEnum: DiaSemanaEnum[];

	public listaIdFacultad: number[];

	public listaIdEdificio: number[];

	public listaIdTipoEspacioFisico: number[];

	public listaNumeroEspacioFisico: string[];
}