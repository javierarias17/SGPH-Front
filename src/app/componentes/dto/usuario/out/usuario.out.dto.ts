import { EstadoUsuarioEnum } from "../../../enum/estado.usuario.enum";
export class UsuarioOutDTO{
    public idPersona: number;
    public idTipoIdentificacion: number;
    public numeroIdentificacion: string;
    public codigoTipoIdentificacion: string;
    public primerNombre: string;
    public segundoNombre: string;
    public primerApellido: string;
    public segundoApellido: string;
    public email: string;
    public nombreUsuario: string;
    public password: string;
    public estado: EstadoUsuarioEnum;
    public lstIdRol: number[];
    public lstIdPrograma: number[];
}