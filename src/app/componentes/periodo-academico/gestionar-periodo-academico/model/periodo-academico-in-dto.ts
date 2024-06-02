import { EstadoPeriodoAcademicoEnum } from "src/app/componentes/enum/estado.periodo.academico.enum";

export class PeriodoAcademicoInDTO {
    public idPeriodoAcademico: number;
    public anio: number;
    public periodo: number;
    public fechaInicioPeriodo: Date;
    public fechaFinPeriodo: Date;
    public estado: EstadoPeriodoAcademicoEnum;
    public esValidar: boolean;

    constructor(){	
        this.idPeriodoAcademico=null;
        this.anio=null;
        this.periodo=null;
        this.fechaInicioPeriodo=null;
        this.fechaFinPeriodo=null;
        this.estado=null;
    }
}