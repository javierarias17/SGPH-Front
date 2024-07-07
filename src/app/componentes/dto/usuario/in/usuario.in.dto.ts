import { EstadoUsuarioEnum } from "../../../enum/estado.usuario.enum";

export class UsuarioInDTO{
    public idPersona: number;
    public idTipoIdentificacion: number | null;
    public numeroIdentificacion: string | null;
    public codigoTipoIdentificacion: string | null;
    public primerNombre: string | null;
    public segundoNombre: string | null;
    public primerApellido: string | null;
    public segundoApellido: string | null;
    public email: string | null;
    public nombreUsuario: string | null;
    public password: string | null;
    public estado: EstadoUsuarioEnum | null;
    public lstIdRol: number[];
    public lstIdPrograma: number[];
    public esDocente: boolean;

    public esValidar: boolean;

    constructor(){
        this.idTipoIdentificacion=null;
        this.numeroIdentificacion=null;
        this.codigoTipoIdentificacion=null;
        this.primerNombre=null;
        this.segundoNombre=null;
        this.primerApellido = null;
        this.segundoApellido =null;
        this.email=null;
        this.nombreUsuario=null;
        this.password=null;
        this.estado=null;
        this.lstIdRol=[];
        this.esDocente=false;
    }
}