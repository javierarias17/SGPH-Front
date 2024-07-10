export class PersonaOutDTO{
    public idPersona:number;
    public idTipoIdentificacion:number;
    public codigoTipoIdentificacion:string;
    public numeroIdentificacion:string;
    public primerNombre:string;
    public segundoNombre:string;
    public primerApellido:string;
    public segundoApellido:string;
    public email:string;

    public sinReferencia:boolean;

    constructor(){ }
}