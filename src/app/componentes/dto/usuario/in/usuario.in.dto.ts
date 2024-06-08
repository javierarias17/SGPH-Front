import { EstadoUsuarioEnum } from "../../../enum/estado.usuario.enum";

export class UsuarioInDTO{
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


    constructor(){
        this.idTipoIdentificacion=null;
        this.numeroIdentificacion=null;
        this.codigoTipoIdentificacion=null;
        this.primerNombre=null;
        this.segundoNombre=null;
        this.email=null;
        this.nombreUsuario=null;
        this.password=null;
        this.estado=null;
        this.lstIdRol=[];
    }
}