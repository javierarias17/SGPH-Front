import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuarioOutDTO } from '../../../dto/usuario/out/usuario.out.dto';
import { UsuarioInDTO } from '../../../dto/usuario/in/usuario.in.dto';
import { ProgramaOutDTO } from '../../../dto/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../../dto/facultad/out/facultad.out.dto';
import { UsuarioService} from '../../../servicios/usuario.service';
import { TipoIdentificacionOutDTO } from '../../../dto/usuario/out/tipo.identificacion.out.dto';
import { RolOutDTO } from '../../../dto/usuario/out/rol.out.dto';
import { MessageService } from 'primeng/api';
import { EstadoUsuarioEnum } from '../../../enum/estado.usuario.enum';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators, FormBuilder, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { RolUsuarioEnum } from '../../../enum/rol.usuario.enum';
import { Observable, map } from 'rxjs';
import { PersonaInDTO } from 'src/app/componentes/dto/persona/persona.in.dto';
import { PersonaService } from 'src/app/componentes/servicios/persona.service';
import { PersonaOutDTO } from 'src/app/componentes/dto/persona/persona.out.dto';
import { ProgramaService } from 'src/app/componentes/servicios/programa.service';
import { FacultadService } from 'src/app/componentes/servicios/facultad.service';


@Component({
  selector: 'app-crear-editar-ver-usuario',
  templateUrl: './crear.editar.ver.usuario.component.html',
  styleUrls: ['./crear.editar.ver.usuario.component.css'],
  providers: [ FacultadService, UsuarioService, LenguajeService]

})
export class CrearEditarVerUsuarioComponent implements OnInit {   
    /** Constante que determina el tipo de operación 'Ver usuario'*/
    private readonly VER_USUARIO :string =  "Ver usuario";
    /** Constante que determina el tipo de operación 'Editar usuario'*/
    private readonly EDITAR_USUARIO :string =  "Editar usuario";

    /** Evento para notificar al padre que el modal se ha cerrado*/
    @Output() modalClosedEmitter = new EventEmitter<void>();

	public mostrarModalCRUD: boolean = false;
	public tituloModal: string = "";

    public esVer: boolean = false;
    public esCrear: boolean = false;
    public esEditar: boolean = false;

    public reactiveForm!: FormGroup;
    
    /** Mapa de todos los programas para accederlos rápidamente por el identificador*/
    public mapaProgramas: Map<number, ProgramaOutDTO> = new Map<number, ProgramaOutDTO>();
    /** Mapa de todos las facultades para accederlos rápidamente por el identificador*/
    public mapaFacultades: Map<number, FacultadOutDTO> = new Map<number, FacultadOutDTO>();
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
    /** Usuario de tipo UsuarioInDTO para las operaciones de Crear y Editar*/  
    public usuarioInDTO:UsuarioInDTO;
    public personaInDTO:PersonaInDTO;

    public name:string;

    /*Bandera para habilitar la selección de programas cuando el tipo de rol es PLANIFICADOR*/
    public esValidoGestionarProgramas:boolean; 
    /*Bandera para deshabilitar los campos de información personal cuando la persona ya existe en BD*/
    public esPersonaExistente:boolean; 

    
    public formulario: FormGroup;

    constructor(private programaService: ProgramaService,
         private facultadService: FacultadService, 
         private usuarioService:UsuarioService,
         private messageService: MessageService,
         private translateService: TranslateService,
         private formBuilder: FormBuilder,
         private personaService:PersonaService){

        this.facultadService.consultarFacultades().subscribe(
            (lstFacultadOutDTO: FacultadOutDTO[]) => {
                this.listaFacultades = lstFacultadOutDTO;
                //Se crea el mapa de facultades  
                lstFacultadOutDTO.forEach((facultadOutDTO: FacultadOutDTO) => {
                    this.mapaFacultades.set(facultadOutDTO.idFacultad, facultadOutDTO);                
                });
            },
            (error) => {
              console.error(error);
            }
        ); 

        this.programaService.consultarProgramas().subscribe(
            (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                //Se crea el mapa de programas  
                lstProgramaOutDTO.forEach((programaOutDTO: ProgramaOutDTO) => {
                    this.mapaProgramas.set(programaOutDTO.idPrograma, programaOutDTO);                
                });
            },
            (error) => {
              console.error(error);
            }
        ); 

        this.usuarioService.consultarRoles().subscribe(
            (lstRolOutDTO: RolOutDTO[]) => {   
                this.listaRoles = lstRolOutDTO.map((rolOutDTO:RolOutDTO) => ({ idRol: rolOutDTO.idRol, rolUsuario:rolOutDTO.rolUsuario, nombre:this.translateService.instant('gestionar.usuario.filtro.rol.usuario.' + rolOutDTO.rolUsuario) }));  
                //Se crea el mapa de roles  
                this.listaRoles.forEach(rolOutDTO =>{
                    this.mapaRoles.set(rolOutDTO.idRol, rolOutDTO);        
                });      
            },
            (error) => {
              console.error(error);
            }
        );

        this.usuarioService.consultarTiposIdentificacion().subscribe(
            (lstTipoIdentificacionOutDTO: TipoIdentificacionOutDTO[]) => {               
                this.listaTiposIdentificacion = lstTipoIdentificacionOutDTO;
            },
            (error) => {
              console.error(error);
            }
        );

        Object.keys(EstadoUsuarioEnum).forEach(key => {
            const translatedLabel = this.translateService.instant('gestionar.usuario.filtro.estado.usuario.' + key);
            this.listaEstados.push({ label: translatedLabel, value: key });
        });
    }
    ngOnInit(): void {
        this.usuarioInDTO= new UsuarioInDTO();
    }


    public asignarDatosFormulario():void{
        this.idTipoIdentificacion().setValue(this.personaInDTO.idTipoIdentificacion);
        this.numeroIdentificacion().setValue(this.personaInDTO.numeroIdentificacion);
        this.primerNombre().setValue(this.personaInDTO.primerNombre);
        this.primerApellido().setValue(this.personaInDTO.primerApellido);
        this.segundoNombre().setValue(this.personaInDTO.segundoNombre);
        this.segundoApellido().setValue(this.personaInDTO.segundoApellido);
        this.email().setValue(this.personaInDTO.email);
        this.nombreUsuario().setValue(this.usuarioInDTO.nombreUsuario);
        this.password().setValue(this.usuarioInDTO.password);
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
    public lstIdFacultadSeleccionadas():FormControl{
        return this.formulario.get("lstIdFacultadSeleccionadas") as FormControl;
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            idTipoIdentificacion: [null, [Validators.required],[this.existeTipoYNumeroIdentificacionValidator()]],
            numeroIdentificacion: [null, [Validators.required],[this.existeTipoYNumeroIdentificacionValidator()]],
            primerNombre: [null, [Validators.required]],
            primerApellido: [null, [Validators.required]],
            segundoNombre: [null],
            segundoApellido: [null],
            email: [null, [Validators.required],[this.existeEmailValidator()]],
            nombreUsuario: [ { value: null, disabled: true }, [Validators.required],[this.existeNombreUsuarioValidator()]],
            password: [null, [Validators.required]],
            estado: [ null, [Validators.required]],
            lstIdRol: [ null, [Validators.required]],
            lstIdPrograma: [ null],
            lstIdFacultadSeleccionadas: [ null]
            //lstIdPrograma: [ null, [Validators.],[this.existeAlMenosUnProgramaParaRolPlanificadorValidator()]]
        })
    }
   
    private existeAlMenosUnProgramaParaRolPlanificadorValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            return this.usuarioService.guardarUsuario(this.usuarioInDTO).pipe(
                map((error) => {
                    for (let key in error) {                    
                        if (key === 'ExisteAlMenosUnProgramaParaRolPlanificador') {
                            return { "ExisteAlMenosUnProgramaParaRolPlanificador": error[key]};
                        }
                    }
                    return null;
                })
            );
        };
    }  

    private existeNombreUsuarioValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            return this.usuarioService.guardarUsuario(this.usuarioInDTO).pipe(
                map((error) => {
                    for (let key in error) {                    
                        if (key === 'ExisteNombreUsuario') {
                            return { "ExisteNombreUsuario": error[key]};
                        }
                    }
                    return null;
                })
            );
        };
    }  

    private existeTipoYNumeroIdentificacionValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            return this.usuarioService.guardarUsuario(this.usuarioInDTO).pipe(
                map((error) => {
                    for (let key in error) {                    
                        if (key === 'ExistsByTipoAndNumeroIdentificacion') {
                            return { "ExistsByTipoAndNumeroIdentificacion": error[key]};
                        }
                    }
                    return null;
                })
            );
        };
    }  

    private existeEmailValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            return this.usuarioService.guardarUsuario(this.usuarioInDTO).pipe(
                map((error) => {
                    for (let key in error) {                    
                        if (key === 'ExisteEmail') {
                            return { "ExisteEmail": error[key]};
                        }
                    }
                    return null;
                })
            );
        };
    }  

    public validarYGuardarUsuario() {
        if (this.formulario.valid) {
            this.personaInDTO.esValidar=false; 
            this.personaInDTO.idTipoIdentificacion=this.idTipoIdentificacion().value;
            this.personaInDTO.numeroIdentificacion=this.numeroIdentificacion().value;
            this.personaInDTO.primerNombre=this.primerNombre().value;
            this.personaInDTO.primerApellido=this.primerApellido().value;
            this.personaInDTO.segundoNombre=this.segundoNombre().value;
            this.personaInDTO.segundoApellido=this.segundoApellido().value;
            this.personaInDTO.email=this.email().value;

            this.usuarioInDTO.esValidar=false; 
            this.usuarioInDTO.nombreUsuario=this.nombreUsuario().value;
            this.usuarioInDTO.password=this.password().value;
            this.usuarioInDTO.estado=this.estado().value;    
            this.usuarioInDTO.lstIdRol=this.lstIdRol().value;    
            this.usuarioInDTO.lstIdPrograma=this.lstIdPrograma().value;
            this.guardarUsuario();    
        }else{
            this.formulario.markAllAsTouched();
            // Obtener los campos inválidos
            const camposInvalidos = Object.keys(this.formulario.controls).filter(controlName =>
                this.formulario.get(controlName).invalid
            );
            console.log('Campos inválidos:', camposInvalidos);
        }
    }

    public  validarCamposBackendUsuario():void{
        this.personaInDTO.esValidar=true;
        this.personaInDTO.idTipoIdentificacion=this.idTipoIdentificacion().value;
        this.personaInDTO.numeroIdentificacion=this.numeroIdentificacion().value;
        this.personaInDTO.primerNombre=this.primerNombre().value;
        this.personaInDTO.primerApellido=this.primerApellido().value;
        this.personaInDTO.segundoNombre=this.segundoNombre().value;
        this.personaInDTO.segundoApellido=this.segundoApellido().value;
        this.personaInDTO.email=this.email().value;
        
        this.usuarioInDTO.esValidar=true;
        this.usuarioInDTO.nombreUsuario=this.nombreUsuario().value;
        this.usuarioInDTO.password=this.password().value;
        this.usuarioInDTO.estado=this.estado().value;    
        this.usuarioInDTO.lstIdRol=this.lstIdRol().value;    
        this.usuarioInDTO.lstIdPrograma=this.lstIdPrograma().value;

        this.formulario.controls['email'].updateValueAndValidity();
        if(this.idTipoIdentificacion().value && this.numeroIdentificacion().value){
            this.formulario.controls['numeroIdentificacion'].updateValueAndValidity();
        }
        this.formulario.controls['nombreUsuario'].updateValueAndValidity();
        this.formulario.controls['lstIdPrograma'].updateValueAndValidity();
    }

	public abrirModal(usuarioOutDTOSeleccionado: UsuarioOutDTO, tituloModal: string) {
        this.usuarioInDTO= new UsuarioInDTO();
        this.esValidoGestionarProgramas=false;
        this.inicializarFormulario();
        this.asignarDatosFormulario();        

        this.esVer = false;
        this.esCrear = false;
        this.esEditar = false;
        this.usuarioOutDTOSeleccionado = usuarioOutDTOSeleccionado;
        this.tituloModal = tituloModal;
        this.mostrarModalCRUD=true;
        
        if(tituloModal===this.VER_USUARIO){
            this.esVer=true;
        }else if(tituloModal===this.EDITAR_USUARIO){
            this.usuarioInDTO= {...usuarioOutDTOSeleccionado};
            this.esEditar = true;
            this.esPersonaExistente=true;
        }else{
            this.esCrear=true;
        }       

        if(tituloModal !== this.VER_USUARIO){
            let lstIdFacultad:number[] =[];
            this.usuarioInDTO.lstIdPrograma.forEach(idPrograma =>{
                let programaOutDTO = this.mapaProgramas.get(idPrograma);
                if(programaOutDTO){
                    lstIdFacultad.push(programaOutDTO.idFacultad);
                }
            })
    
            this.lstIdFacultadSeleccionadas().setValue([... new Set(lstIdFacultad)]);
    
            this.lstIdFacultadSeleccionadas().value.forEach(idFacultad => {
                this.mapaProgramas.forEach(programaOutDTO => {
                    if(programaOutDTO.idFacultad===idFacultad){
                        this.listaProgramas.push(programaOutDTO);
                    }
                });            
            });
        }

        if(this.usuarioOutDTOSeleccionado.lstIdPrograma !==null && this.usuarioOutDTOSeleccionado.lstIdPrograma.length > 0){
            this.esValidoGestionarProgramas=true;
        }else{
            this.esValidoGestionarProgramas=false;
        }
        this.inicializarFormulario();
        this.asignarDatosFormulario(); 
        this.desactivarActivarCamposPersona();
	}

    public onFacultadesChange(){
        if(this.lstIdFacultadSeleccionadas().value!==null && this.lstIdFacultadSeleccionadas().value.length !== 0){
            this.programaService.consultarProgramasPorIdFacultad(this.lstIdFacultadSeleccionadas().value).subscribe(
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

    /**
     * Método invocado por 
     *
     * @author parias 
     */
    public onRolesChange(): void {
        let rolOutDTO:RolOutDTO | undefined = this.listaRoles.find(rolOutDTO=>rolOutDTO.rolUsuario===RolUsuarioEnum.ROLE_PLANIFICADOR);
        if(rolOutDTO && this.lstIdRol().value !== null && this.lstIdRol().value.includes(rolOutDTO.idRol)){
            this.esValidoGestionarProgramas=true;
        }else{
            this.esValidoGestionarProgramas=false;
        }
    }

    public onNumeroIdentificacionBlur():void{
        if(this.numeroIdentificacion().value && this.idTipoIdentificacion().value){
            this.personaService.consultarPersonaPorIdentificacion(this.idTipoIdentificacion().value, this.numeroIdentificacion().value).subscribe(
                (personaOutDTO: PersonaOutDTO) => {
                    if(personaOutDTO){
                        this.primerNombre().setValue(personaOutDTO.primerNombre);
                        this.segundoNombre().setValue(personaOutDTO.segundoNombre);
                        this.primerApellido().setValue(personaOutDTO.primerApellido);
                        this.segundoApellido().setValue(personaOutDTO.segundoApellido);
                        this.email().setValue(personaOutDTO.email);
                        this.esPersonaExistente=true;
                    }else{
                        this.primerNombre().setValue(null);
                        this.segundoNombre().setValue(null);
                        this.primerApellido().setValue(null);
                        this.segundoApellido().setValue(null);
                        this.email().setValue(null);
                        this.esPersonaExistente=false;
                    }
                    this.desactivarActivarCamposPersona();                  
                },
                (error) => {
                    console.error(error);
                }
            );  
        }
    }

    private desactivarActivarCamposPersona():void{
        //if(this.usuarioInDTO.esDocente===true){
            this.primerNombre().disable()
            this.segundoNombre().disable()
            this.primerApellido().disable()
            this.segundoApellido().disable()
            this.email().disable()
        //}else{
            this.primerNombre().enable()
            this.segundoNombre().enable()
            this.primerApellido().enable()
            this.segundoApellido().enable()
            this.email().enable()
        //}
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
        return (this.usuarioOutDTOSeleccionado.primerNombre? this.usuarioOutDTOSeleccionado.primerNombre+" ": "")
                +(this.usuarioOutDTOSeleccionado.segundoNombre? this.usuarioOutDTOSeleccionado.segundoNombre+" ": "")
                +(this.usuarioOutDTOSeleccionado.primerApellido? this.usuarioOutDTOSeleccionado.primerApellido+" ": "")
                +(this.usuarioOutDTOSeleccionado.segundoApellido? this.usuarioOutDTOSeleccionado.segundoApellido: "");
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

    private guardarUsuario() {
        this.usuarioService.guardarUsuario(this.usuarioInDTO).subscribe(
            (usuarioOutDTO: UsuarioOutDTO) => {
                let mensajeDetalle = "";
                if(this.usuarioInDTO.idPersona){
                    mensajeDetalle = this.translateService.instant('gestionar.usuario.mensaje.exito.usuario.modificado.con.exito');
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensajeDetalle });
                }else{
                    mensajeDetalle = this.translateService.instant('gestionar.usuario.mensaje.exito.usuario.creado.con.exito');
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensajeDetalle });
                }

            },
            (error) => {
              console.error(error);
            }
        ); 
    }

    public salir() {
        this.listaProgramas=[];
        this.mostrarModalCRUD=false;
        this.modalClosedEmitter.emit();   
    }
}