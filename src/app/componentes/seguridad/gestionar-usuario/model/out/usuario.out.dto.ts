import { RolUsuarioEnum } from "src/app/componentes/common/enum/rol.usuario.enum";
import { EstadoUsuarioEnum } from "../../../../common/enum/estado.usuario.enum";
export class UsuarioOutDTO{
    public idUsuario: number;
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
    public lstIdRol: any[];
    public lstIdPrograma: number[];
    lstRol: RolUsuarioEnum[]
}