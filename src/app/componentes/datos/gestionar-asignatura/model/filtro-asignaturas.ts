import { FiltroBase } from "src/app/componentes/dto/filtro-base";
import { AsignaturaOutDTO } from "./asignatura-dto";

export interface FiltroAsignaturasDTO extends FiltroBase {
    content?: AsignaturaOutDTO[]
    totalElements?: number,
    idFacultades?: number [],
    idProgramas?: number [],
    semestre?: number
}