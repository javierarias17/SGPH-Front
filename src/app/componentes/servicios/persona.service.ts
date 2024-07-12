import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PersonaOutDTO } from "../dto/persona/persona.out.dto";
import { PersonaInDTO } from "../dto/persona/persona.in.dto";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class PersonaService{

    urlPersona: string = "AdministrarPersona"
    constructor(private http: HttpClient) {
    }

    public guardarPersona(personaInDTO:PersonaInDTO): Observable<PersonaOutDTO>{
        const url = `${environment.url}${this.urlPersona}/guardarPersona`;
        return this.http.post<any>(url, personaInDTO);   
    }

	public consultarPersonaPorIdentificacion(idTipoIdentificacion:number, numeroIdentificacion:string) {
        const url = `${environment.url}${this.urlPersona}/consultarPersonaPorIdentificacion=${idTipoIdentificacion}&numeroIdentificacion=${numeroIdentificacion}`;
        return this.http.get<PersonaOutDTO>(url);
    }  
}