import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PersonaOutDTO } from "../../datos/gestionar-persona/model/out/persona.out.dto";
import { PersonaInDTO } from "../../datos/gestionar-persona/model/in/persona.in.dto";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { TipoIdentificacionOutDTO } from "../../seguridad/gestionar-usuario/model/out/tipo.identificacion.out.dto";

@Injectable({providedIn: 'root'})
export class PersonaService {

    urlPersona: string = "AdministrarPersona"
    constructor(private http: HttpClient) {
    }

    public guardarPersona(personaInDTO:PersonaInDTO): Observable<PersonaOutDTO>{
        const url = `${environment.url}${this.urlPersona}/guardarPersona`;
        return this.http.post<any>(url, personaInDTO);   
    }

	public consultarPersonaPorIdentificacion(idTipoIdentificacion:number, numeroIdentificacion:string) {
        const url = `${environment.url}${this.urlPersona}/consultarPersonaPorIdentificacion?idTipoIdentificacion=${idTipoIdentificacion}&numeroIdentificacion=${numeroIdentificacion}`;
        return this.http.get<PersonaOutDTO>(url);
    }  

    /**
	 * Método encargado de consultar todos los tipos de identificación de
	 * persona.
	 * 
	 * @author apedro
	 * 
	 * @return
	 */
	public consultarTiposIdentificacion() {
		const url = `${environment.url}${this.urlPersona}/consultarTiposIdentificacion`;
        return this.http.get<TipoIdentificacionOutDTO[]>(url);
    }
    public consultarPersonaPorEmail(email: string) {
        const url = `${environment.url}${this.urlPersona}/consultarPersonaPorEmail?email=${email}`;
        return this.http.get<PersonaOutDTO>(url);
    }
    public consultarPersonasPaginadas(
        page: number = 0,
        size: number = 10,
        sortBy: string = 'numeroIdentificacion',
        sortOrder: string = 'asc'
      ): Observable<any> {
        const url = `${environment.url}${this.urlPersona}/consultarPersonasPaginadas?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        return this.http.get<any>(url);
    }

    obtenerPersona(idPersona: number): Observable<PersonaOutDTO> {
        const url = `${environment.url}${this.urlPersona}/obtenerPersona/${idPersona}`;
        return this.http.get<PersonaOutDTO>(url);
    }
      
    public eliminarPersona(idPersona: number): Observable<void> {
        const url = `${environment.url}${this.urlPersona}/eliminarPersona/${idPersona}`;
        return this.http.delete<void>(url);
    }
    
}