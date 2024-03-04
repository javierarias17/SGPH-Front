import { EstadoDocenteEnum } from "src/app/componentes/enum/estado.docente.enum";

export class DocenteOutDTO{
    public idPersona: number;
    public idTipoIdentificacion: number;
    public numeroIdentificacion: string;
    public codigoTipoIdentificacion: string;
    public primerNombre: string;
    public segundoNombre: string;
    public primerApellido: string;
    public segundoApellido: string;
    public email: string;
    public codigo: string;
    public estado: EstadoDocenteEnum;
}