import { AgrupadorDTO } from "./agrupador-dto";

export interface AgrupacionPorFacultad {
    idFacultad: number;
    nombreFacultad: string;
    agrupadorDTOs: AgrupadorDTO[];
}