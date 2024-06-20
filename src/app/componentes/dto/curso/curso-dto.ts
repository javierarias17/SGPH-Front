export interface CursoDTO {
    idCurso: number,
    nombreFacultad: string,
    idFacultad: number,
    idPrograma: number,
    nombrePrograma: string,
    nombreCurso: string,
    grupo: string,
    OIDAsignatura: string,
    semestre: number,
    horas: number,
    cupo: number,
    periodoAcademico: string,
    aulas: any[]
    idAsignatura: string
}