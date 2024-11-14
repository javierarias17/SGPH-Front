import { EstadoUsuarioEnum } from "../../../../common/enum/estado.usuario.enum";

export class UsuarioInDTO{
    public idUsuario: number;
    public idPersona: number;
    public nombreUsuario: string | null;
    public password: string | null;
    public estado: EstadoUsuarioEnum | null;
    public lstIdRol: number[];
    public lstIdPrograma: number[];

    public esValidar?: boolean;

    constructor(){
        this.idUsuario=null;
        this.idPersona=null;
        this.nombreUsuario=null;
        this.password=null;
        this.estado=null;
        this.lstIdRol=[];
        this.lstIdPrograma=[];
    }
}