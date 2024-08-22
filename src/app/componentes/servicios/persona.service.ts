import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PersonaOutDTO } from "../dto/persona/persona.out.dto";
import { PersonaInDTO } from "../dto/persona/persona.in.dto";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { TipoIdentificacionOutDTO } from "../dto/usuario/out/tipo.identificacion.out.dto";

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
}