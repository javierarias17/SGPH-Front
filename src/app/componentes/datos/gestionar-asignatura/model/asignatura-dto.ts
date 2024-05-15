import { AgrupadorDTO } from "./agrupador-dto";

export interface AsignaturaOutDTO {
    idAsignatura: number;
    nombre: string;
    codigoAsignatura: string;
    OID: string;
    semestre: number;
    pensum: string;
    horasSemana: number;
    idPrograma: number;
    nombreFacultad: string
    nombrePrograma: string
    lstIdAgrupadorEspacioFisico: number[];
    agrupadores: AgrupadorDTO[]
    idFacultad: string
}
