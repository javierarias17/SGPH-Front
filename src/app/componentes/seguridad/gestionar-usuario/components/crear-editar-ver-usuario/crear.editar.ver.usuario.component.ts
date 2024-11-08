import { Component, OnInit } from '@angular/core';
import { UsuarioOutDTO } from '../../model/out/usuario.out.dto';
import { UsuarioInDTO } from '../../model/in/usuario.in.dto';
import { ProgramaOutDTO } from '../../../../common/model/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../../../common/model/facultad/out/facultad.out.dto';
import { UsuarioService} from '../../../../common/services/usuario.service';
import { TipoIdentificacionOutDTO } from '../../model/out/tipo.identificacion.out.dto';
import { RolOutDTO } from '../../model/out/rol.out.dto';
import { MessageService } from 'primeng/api';
import { EstadoUsuarioEnum } from '../../../../common/enum/estado.usuario.enum';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators, FormBuilder, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { LenguajeService } from '../../../../common/services/lenguaje.service';
import { RolUsuarioEnum } from '../../../../common/enum/rol.usuario.enum';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { PersonaService } from 'src/app/componentes/common/services/persona.service';
import { ProgramaService } from 'src/app/componentes/common/services/programa.service';
import { FacultadService } from 'src/app/componentes/common/services/facultad.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { PersonaInDTO } from 'src/app/componentes/datos/gestionar-persona/model/in/persona.in.dto';
import { PersonaOutDTO } from 'src/app/componentes/datos/gestionar-persona/model/out/persona.out.dto';


@Component({
  selector: 'app-crear-editar-ver-usuario',
  templateUrl: './crear.editar.ver.usuario.component.html',
  providers: [ LenguajeService]
})
export class CrearEditarVerUsuarioComponent implements OnInit {   
    
    /** Mapa de todos los programas para accederlos rápidamente por el identificador*/
    public mapaProgramas: Map<number, ProgramaOutDTO> = new Map<number, ProgramaOutDTO>();
    /** Mapa de roles para accederlos rápidamente por el identificador*/
    public mapaRoles: Map<number, RolOutDTO> = new Map<number, RolOutDTO>();

    /** Listas de facultades para el selector multiple facultad*/
    public listaFacultades: FacultadOutDTO[] = [];    
    /** Listas de programas para el selector multiple programas*/
    public listaProgramas: ProgramaOutDTO[] = [];
    /** Listas de roles para el selector multiple roles*/
    public listaRoles: RolOutDTO[] = [];  
    /** Listas de estados de usuario para el selector único estado*/
    public listaEstados:{ label: string; value: string }[] = [];  
    /** Listas de tipo de identificación para el selector único tipo de identificación*/
    public listaTiposIdentificacion:TipoIdentificacionOutDTO[] = [];  

    /** Usuario que ingresa al componente*/    
	public usuarioOutDTOSeleccionado:UsuarioOutDTO;
    /** DTOs para las operaciones de Crear y Editar*/  
    public usuarioInDTO:UsuarioInDTO;
    public personaInDTO:PersonaInDTO;

    /*Bandera para habilitar la selección de facultad y programas cuando el tipo de rol es PLANIFICADOR*/
    public esValidoGestionarProgramas:boolean; 
    /*Bandera para deshabilitar los campos de información personal cuando la persona ya existe en BD*/
    public esPersonaExistente:boolean; 

    public lectura: boolean;
    public formulario: FormGroup;

    constructor(private programaService: ProgramaService,
         private facultadService: FacultadService, 
         private usuarioService:UsuarioService,
         private translateService: TranslateService,
         private formBuilder: FormBuilder,
         private personaService:PersonaService,
         private config: DynamicDialogConfig,
         private ref: DynamicDialogRef,
         private messageService: MessageService){
    }
    public ngOnInit(): void {
        this.lectura=this.config.data.lectura;
        this.inicializarFormulario() ;
        forkJoin([
            this.facultadService.consultarFacultades(),
            this.programaService.consultarProgramas(),
            this.usuarioService.consultarRoles(),
            this.personaService.consultarTiposIdentificacion()
          ]).subscribe(
            ([lstFacultadOutDTO, lstProgramaOutDTO, lstRolOutDTO, lstTipoIdentificacionOutDTO]) => {
                this.listaFacultades = lstFacultadOutDTO;

                //Se crea el mapa de programas  
                lstProgramaOutDTO.forEach((programaOutDTO: ProgramaOutDTO) => {
                    this.mapaProgramas.set(programaOutDTO.idPrograma, programaOutDTO);                
                });

                this.listaRoles = lstRolOutDTO.map((rolOutDTO:RolOutDTO) => ({ idRol: rolOutDTO.idRol, rolUsuario:rolOutDTO.rolUsuario, nombre:this.translateService.instant('gestionar.usuario.filtro.rol.usuario.' + rolOutDTO.rolUsuario) }));  
                //Se crea el mapa de roles  
                this.listaRoles.forEach(rolOutDTO =>{
                    this.mapaRoles.set(rolOutDTO.idRol, rolOutDTO);        
                });   

                this.listaTiposIdentificacion = lstTipoIdentificacionOutDTO;
      
                Object.keys(EstadoUsuarioEnum).forEach(key => {
                const translatedLabel = this.translateService.instant('gestionar.usuario.filtro.estado.usuario.' + key);
                this.listaEstados.push({ label: translatedLabel, value: key });
                });

                this.lectura=this.config.data.lectura;
                this.inicializarFormulario();
                this.esPersonaExistente=false;  
                this.usuarioInDTO= new UsuarioInDTO();
                this.personaInDTO=new PersonaInDTO();
        
                if(this.config.data?.usuarioOutDTOSeleccionado){
                    this.usuarioOutDTOSeleccionado=this.config.data?.usuarioOutDTOSeleccionado;
                    this.usuarioInDTO= {...this.usuarioOutDTOSeleccionado};
                    this.personaInDTO.idPersona=this.usuarioOutDTOSeleccionado.idPersona;
                    this.personaInDTO.idTipoIdentificacion=this.usuarioOutDTOSeleccionado.idTipoIdentificacion;
                    this.personaInDTO.numeroIdentificacion=this.usuarioOutDTOSeleccionado.numeroIdentificacion;
                    this.personaInDTO.primerNombre=this.usuarioOutDTOSeleccionado.primerNombre;
                    this.personaInDTO.primerApellido=this.usuarioOutDTOSeleccionado.primerApellido;
                    this.personaInDTO.segundoNombre=this.usuarioOutDTOSeleccionado.segundoNombre;
                    this.personaInDTO.segundoApellido=this.usuarioOutDTOSeleccionado.segundoApellido;
                    this.personaInDTO.email=this.usuarioOutDTOSeleccionado.email;
                    this.esPersonaExistente=true;                       
                }
        
                if(this.lectura===false){
                    let lstIdFacultad:number[] =[];
                    this.usuarioInDTO.lstIdPrograma.forEach(idPrograma =>{
                        let programaOutDTO = this.mapaProgramas.get(idPrograma);
                        if(programaOutDTO){
                            lstIdFacultad.push(programaOutDTO.idFacultad);
                        }
                    })
            
                    this.idFacultad().setValue(lstIdFacultad.length > 0 ? lstIdFacultad[0]:undefined);    
                    
                    this.mapaProgramas.forEach(programaOutDTO => {
                        if(programaOutDTO.idFacultad===this.idFacultad().value){
                            this.listaProgramas.push(programaOutDTO);
                        }
                    });            
                   
                    this.asignarDatosFormulario();
                    if(this.esPersonaExistente===true){
                        this.desactivarCamposPersona();
                    }else{
                        this.activarCamposPersona();
                    }
                    this.onRolesChange();
                }
            },
            (error) => {
              console.error('Error fetching data:', error);
            }
          );       
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            idTipoIdentificacion: [null, [Validators.required]],
            numeroIdentificacion: [null, [Validators.required],this.existeUsuarioConPersonaValidator()],
            primerNombre: [null, [Validators.required]],
            primerApellido: [null, [Validators.required]],
            segundoNombre: [null],
            segundoApellido: [null],
            email: [null, [Validators.required, Validators.email],[this.existeEmailValidator(),this.existeNombreUsuarioValidator()]],
            nombreUsuario: [ { value: null, disabled: true }, [Validators.required]],
            password: [null, [Validators.required]],
            estado: [ null, [Validators.required]],
            lstIdRol: [ null, [Validators.required]],
            lstIdPrograma: [ null,[Validators.required]],
            idFacultad: [ null,[Validators.required]]
        })
    }

    private asignarDatosFormulario():void{
        this.idTipoIdentificacion().setValue(this.personaInDTO.idTipoIdentificacion);
        this.numeroIdentificacion().setValue(this.personaInDTO.numeroIdentificacion);
        this.primerNombre().setValue(this.personaInDTO.primerNombre);
        this.primerApellido().setValue(this.personaInDTO.primerApellido);
        this.segundoNombre().setValue(this.personaInDTO.segundoNombre);
        this.segundoApellido().setValue(this.personaInDTO.segundoApellido);
        this.email().setValue(this.personaInDTO.email);

        this.nombreUsuario().setValue(this.usuarioInDTO.nombreUsuario);
        this.estado().setValue(this.usuarioInDTO.estado);
        this.lstIdRol().setValue(this.usuarioInDTO.lstIdRol);
        this.lstIdPrograma().setValue(this.usuarioInDTO.lstIdPrograma);
    }

    public idTipoIdentificacion():FormControl{
        return this.formulario.get("idTipoIdentificacion") as FormControl;
    }
    public numeroIdentificacion():FormControl{
        return this.formulario.get("numeroIdentificacion") as FormControl;
    }
    public primerNombre():FormControl{
        return this.formulario.get("primerNombre") as FormControl;
    }
    public primerApellido():FormControl{
        return this.formulario.get("primerApellido") as FormControl;
    }
    public segundoNombre():FormControl{
        return this.formulario.get("segundoNombre") as FormControl;
    }
    public segundoApellido():FormControl{
        return this.formulario.get("segundoApellido") as FormControl;
    }
    public email():FormControl{
        return this.formulario.get("email") as FormControl;
    }
    public nombreUsuario():FormControl{
        return this.formulario.get("nombreUsuario") as FormControl;
    }
    public password():FormControl{
        return this.formulario.get("password") as FormControl;
    }
    public estado():FormControl{
        return this.formulario.get("estado") as FormControl;
    }
    public lstIdRol():FormControl{
        return this.formulario.get("lstIdRol") as FormControl;
    }
    public lstIdPrograma():FormControl{
        return this.formulario.get("lstIdPrograma") as FormControl;
    }
    public idFacultad():FormControl{
        return this.formulario.get("idFacultad") as FormControl;
    }

    public existeUsuarioConPersonaValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
                          
            if (!this.numeroIdentificacion().value || !this.idTipoIdentificacion().value) {
                return of(null); 
            }
    
            return this.personaService.consultarPersonaPorIdentificacion(this.idTipoIdentificacion().value, this.numeroIdentificacion().value).pipe(
            switchMap((personaOutDTO: PersonaOutDTO) => {
                if (personaOutDTO) {
                    this.usuarioInDTO.idPersona =  personaOutDTO.idPersona;
    
                    return this.usuarioService.guardarUsuario(this.usuarioInDTO).pipe(
                        map(() => null),  // Si no hay error, la validación pasa
                        catchError((error) => {
                            if (error.status === 400) {  // Si es un BadRequest (400), procesamos el error
                                for (let key in error.error) {  // Accedemos a error.error para obtener los detalles
                                    if (key === 'ExisteIdPersonaUsuario') {
                                        return of({ "ExisteIdPersonaUsuario": error.error[key] });
                                    }
                                }
                            }
                            return of(null);  // En caso de otros errores, devolvemos null
                        })
                    );                
                } else {
                    this.personaInDTO.idPersona = null;
                    this.usuarioInDTO.idPersona = null;
                    return of(null);
                }
            }),
            catchError(() => of(null)) 
            );
        };
    }    
           

    private existeNombreUsuarioValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.usuarioService.guardarUsuario(this.usuarioInDTO).pipe(
                map(() => null),  // Si no hay error, la validación pasa
                catchError((error) => {
                    if (error.status === 400) {  // Si es un BadRequest (400), procesamos el error
                        for (let key in error.error) {  // Accedemos a error.error para obtener los detalles
                            if (key === 'ExisteNombreUsuario') {
                                return of({ "ExisteNombreUsuario": error.error[key] });
                            }
                        }
                    }
                    return of(null);  // En caso de otros errores, devolvemos null
                })
            );
        };
    }     

    private existeEmailValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.personaService.guardarPersona(this.personaInDTO).pipe(
                map(() => null),  // Si no hay error, la validación pasa
                catchError((error) => {
                    if (error.status === 400) {  // Si es un BadRequest (400), procesamos el error
                        for (let key in error.error) {  // Accedemos a error.error para obtener los detalles
                            if (key === 'ExisteEmail') {
                                return of({ "ExisteEmail": error.error[key] });
                            }
                        }
                    }
                    return of(null);  // En caso de otros errores, devolvemos null
                })
            );
        };
    }    

    public validarYGuardarUsuario() {
        if (this.formulario.valid) {
            this.personaInDTO.esValidar=false; 
            this.establecerValoresPersonaInDTO();

            this.usuarioInDTO.esValidar=false; 
            this.establecerValoresUsuarioInDTO();

            this.guardarPersona();   
        }else{
            this.formulario.markAllAsTouched();
            // Obtener los campos inválidos
            const camposInvalidos = Object.keys(this.formulario.controls).filter(controlName =>
                this.formulario.get(controlName).invalid
            );
            console.log('Campos inválidos:', camposInvalidos);
        }
    }

    public  validarCamposBackendUsuarioYPersona():void{
                this.personaInDTO.esValidar=true;
        this.establecerValoresPersonaInDTO();
        
        this.usuarioInDTO.esValidar=true;
        this.establecerValoresUsuarioInDTO();
        
        if(this.idTipoIdentificacion().value && this.numeroIdentificacion().value){
            this.formulario.controls['numeroIdentificacion'].updateValueAndValidity();
        }
        this.formulario.controls['email'].updateValueAndValidity();
        this.formulario.controls['nombreUsuario'].updateValueAndValidity();
        this.formulario.controls['lstIdPrograma'].updateValueAndValidity();
    }

    private establecerValoresUsuarioInDTO():void{
        this.usuarioInDTO.nombreUsuario=this.nombreUsuario().value;
        this.usuarioInDTO.password=this.password().value;
        this.usuarioInDTO.estado=this.estado().value;    
        this.usuarioInDTO.lstIdRol=this.lstIdRol().value;    
        this.usuarioInDTO.lstIdPrograma=this.lstIdPrograma().value;
    }
    private establecerValoresPersonaInDTO():void{
        this.personaInDTO.idTipoIdentificacion=this.idTipoIdentificacion().value;
        this.personaInDTO.numeroIdentificacion=this.numeroIdentificacion().value;
        this.personaInDTO.primerNombre=this.primerNombre().value;
        this.personaInDTO.primerApellido=this.primerApellido().value;
        this.personaInDTO.segundoNombre=this.segundoNombre().value;
        this.personaInDTO.segundoApellido=this.segundoApellido().value;
        this.personaInDTO.email=this.email().value;
    }

    public onFacultadesChange(){
        if(this.idFacultad().value!==null){
            this.programaService.consultarProgramasPorIdFacultad([this.idFacultad().value]).subscribe(
                (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                    if(lstProgramaOutDTO.length === 0){
                        this.listaProgramas=[];
                    }else{
                        this.lstIdPrograma().setValue([]);
                        this.listaProgramas = lstProgramaOutDTO;
                    }
                },
                (error) => {
                    console.error(error);
                }
                );   
        }else{
            this.listaProgramas=[];
            this.lstIdPrograma().setValue([]);
        }
    }   

    public onRolesChange(): void {
        let rolOutDTO:RolOutDTO | undefined = this.listaRoles.find(rolOutDTO=>rolOutDTO.rolUsuario===RolUsuarioEnum.ROLE_PLANIFICADOR);
        if(rolOutDTO && this.lstIdRol().value !== null && this.lstIdRol().value.includes(rolOutDTO.idRol)){
            this.formulario.get('lstIdPrograma').setValidators([Validators.required]);
            this.formulario.get('idFacultad').setValidators([Validators.required]);
            this.esValidoGestionarProgramas=true;
        }else{
            this.formulario.get('lstIdPrograma').clearValidators();
            this.formulario.get('idFacultad').clearValidators();
            this.lstIdPrograma().setValue(null);
            this.idFacultad().setValue(null);
            this.esValidoGestionarProgramas=false;
        }
        // Actualizar la validez del formulario después de cambiar los validadores
        this.formulario.get('lstIdPrograma').updateValueAndValidity();
        this.formulario.get('idFacultad').updateValueAndValidity();
    }

    public onNumeroIdentificacionBlur():void{
        if(this.numeroIdentificacion().value && this.idTipoIdentificacion().value){
            this.personaService.consultarPersonaPorIdentificacion(this.idTipoIdentificacion().value, this.numeroIdentificacion().value).subscribe(
                (personaOutDTO: PersonaOutDTO) => {
                    if(personaOutDTO){
                        this.establecerCamposPersona(personaOutDTO);
                        this.esPersonaExistente=true;
                        this.desactivarCamposPersona();
                    }else{
                        this.establecerCamposPersona(null);
                        this.esPersonaExistente=false;
                        this.activarCamposPersona();
                    }
                },
                (error) => {
                    console.error(error);
                }
            );  
        }
    }

    private establecerCamposPersona(personaOutDTO: PersonaOutDTO):void{
        if(personaOutDTO){
            this.personaInDTO.idPersona=personaOutDTO.idPersona;
            this.usuarioInDTO.idPersona=personaOutDTO.idPersona;
            this.primerNombre().setValue(personaOutDTO.primerNombre);
            this.segundoNombre().setValue(personaOutDTO.segundoNombre);
            this.primerApellido().setValue(personaOutDTO.primerApellido);
            this.segundoApellido().setValue(personaOutDTO.segundoApellido);
            this.email().setValue(personaOutDTO.email);
        }else{
            this.personaInDTO.idPersona=null;
            this.usuarioInDTO.idPersona=null;
            this.primerNombre().setValue(null);
            this.segundoNombre().setValue(null);
            this.primerApellido().setValue(null);
            this.segundoApellido().setValue(null);
            this.email().setValue(null);
            
            this.nombreUsuario().setValue(null);
        }
    }

    private desactivarCamposPersona():void{
        this.primerNombre().disable()
        this.segundoNombre().disable()
        this.primerApellido().disable()
        this.segundoApellido().disable()
        this.email().disable()
    }

    private activarCamposPersona():void{
        this.primerNombre().enable()
        this.segundoNombre().enable()
        this.primerApellido().enable()
        this.segundoApellido().enable()
        this.email().enable()
    }

    public inputsChangeCorreo(): void {
        if (this.email().value) {
            const partes = this.email().value.split('@');

            if (partes.length > 1 && partes[0]) {
                this.nombreUsuario().setValue(partes[0]);
            } else {
                this.nombreUsuario().setValue('');
            }
        } 
    }

    public obtenerNombreCompletoUsuario():string{
        return (this.usuarioOutDTOSeleccionado?.primerNombre? this.usuarioOutDTOSeleccionado?.primerNombre+" ": "")
                +(this.usuarioOutDTOSeleccionado?.segundoNombre? this.usuarioOutDTOSeleccionado?.segundoNombre+" ": "")
                +(this.usuarioOutDTOSeleccionado?.primerApellido? this.usuarioOutDTOSeleccionado?.primerApellido+" ": "")
                +(this.usuarioOutDTOSeleccionado?.segundoApellido? this.usuarioOutDTOSeleccionado?.segundoApellido: "");
    }

    public obtenerNombrePrograma(idPrograma: number):string{
        const programa = this.mapaProgramas.get(idPrograma);
        if (programa) {
            return programa.nombre;
        }
        return "";
    }

    public obtenerNombreRol(idRol: number):string{
        const rolOutDTO = this.mapaRoles.get(idRol);
        if (rolOutDTO) {
            return this.translateService.instant('gestionar.usuario.filtro.rol.usuario.' + rolOutDTO.rolUsuario);
        }
        return "";
    }
    
    private guardarPersona() {
        if(this.personaInDTO.idPersona===null){
            this.personaService.guardarPersona(this.personaInDTO).subscribe(
                (personaOutDTO: PersonaOutDTO) => {
                    if(personaOutDTO.idPersona){
                        this.personaInDTO.idPersona=personaOutDTO.idPersona;
                        this.usuarioInDTO.idPersona=personaOutDTO.idPersona;
                        this.guardarUsuario();
                    }
                },
                (error) => {
                  console.error(error);
                }
            ); 
        }else{
            this.usuarioInDTO.idPersona=this.personaInDTO.idPersona;
            this.guardarUsuario();
        }
    }

    private guardarUsuario() {
        this.usuarioService.guardarUsuario(this.usuarioInDTO).subscribe({
            next: (r) => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario guardado' });
                this.ref.close()
                console.log(r)
              },
              error: (r) => {
                this.messageService.add({ severity: 'error', detail: 'Error al guardar' });
                console.log(r)
              }
        }); 
    }

    public salir() {
        this.ref.close()
    }
}