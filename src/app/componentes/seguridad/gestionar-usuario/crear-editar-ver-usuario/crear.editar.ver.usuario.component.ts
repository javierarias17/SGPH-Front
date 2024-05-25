import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UsuarioOutDTO } from '../../../dto/usuario/out/usuario.out.dto';
import { UsuarioInDTO } from '../../../dto/usuario/in/usuario.in.dto';
import { ProgramaServicio } from '../../../servicios/programa.servicio';
import { ProgramaOutDTO } from '../../../dto/programa/out/programa.out.dto';
import { FacultadOutDTO } from '../../../dto/facultad/out/facultad.out.dto';
import { FacultadServicio } from '../../../servicios/facultad.servicio';
import { UsuarioServicio } from '../../../servicios/usuario.servicio';
import { TipoIdentificacionOutDTO } from '../../../dto/usuario/out/tipo.identificacion.out.dto';
import { RolOutDTO } from '../../../dto/usuario/out/rol.out.dto';
import { MessageService } from 'primeng/api';
import { EstadoUsuarioEnum } from '../../../enum/estado.usuario.enum';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { LenguajeServicio } from '../../../servicios/lenguaje.servicio';
import { RolUsuarioEnum } from 'src/app/componentes/enum/rol.usuario.enum';


@Component({
  selector: 'app-crear-editar-ver-usuario',
  templateUrl: './crear.editar.ver.usuario.component.html',
  styleUrls: ['./crear.editar.ver.usuario.component.css'],
  providers: [ FacultadServicio, UsuarioServicio, LenguajeServicio]

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

    /** Listas de facultades seleccionadas en el selector*/
    public lstIdFacultadSeleccionadas: number[] = [];    

    /** Usuario que ingresa al componente*/    
	public usuarioOutDTOSeleccionado:UsuarioOutDTO;
    /** Usuario de tipo UsuarioInDTO para las operaciones de Crear y Editar*/  
    public usuarioInDTO:UsuarioInDTO;

    public name:string;

    /*Bandera para habilitar la selección de programas cuando el tipo de rol es PLANIFICADOR*/
    public esValidoGestionarProgramas:boolean; 
    /*Bandera para deshabilitar los campos de información personal cuando la persona ya existe en BD*/
    public esPersonaExistente:boolean; 

    constructor(private programaServicio: ProgramaServicio,
         private facultadServicio: FacultadServicio, 
         private usuarioServicio:UsuarioServicio,
         private messageService: MessageService,
         private translateService: TranslateService){

        this.facultadServicio.consultarFacultades().subscribe(
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

        this.programaServicio.consultarProgramas().subscribe(
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

        this.usuarioServicio.consultarRoles().subscribe(
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

        this.usuarioServicio.consultarTiposIdentificacion().subscribe(
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
        this.esValidoGestionarProgramas=false;
        /*this.reactiveForm = new FormGroup({
            name: new FormControl(this.name, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(10),
              ])
        });*/
    }

	public abrirModal(usuarioOutDTOSeleccionado: UsuarioOutDTO, tituloModal: string) {
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
            this.usuarioInDTO= new UsuarioInDTO();
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
    
            this.lstIdFacultadSeleccionadas = [... new Set(lstIdFacultad)];
    
            this.lstIdFacultadSeleccionadas.forEach(idFacultad => {
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
        
	}

    public onFacultadesChange(){
        if(this.lstIdFacultadSeleccionadas!==null && this.lstIdFacultadSeleccionadas.length !== 0){
            this.programaServicio.consultarProgramasPorIdFacultad(this.lstIdFacultadSeleccionadas).subscribe(
                (lstProgramaOutDTO: ProgramaOutDTO[]) => {
                    if(lstProgramaOutDTO.length === 0){
                        this.listaProgramas=[];
                    }else{
                        this.usuarioInDTO.lstIdPrograma=[];
                        this.listaProgramas = lstProgramaOutDTO;
                    }
                },
                (error) => {
                    console.error(error);
                }
                );   
        }else{
            this.listaProgramas=[];
            this.usuarioInDTO.lstIdPrograma=[];
        }
    }   

    /**
     * Método invocado por 
     *
     * @author parias 
     */
    public onRolesChange(): void {
        let rolOutDTO:RolOutDTO = this.listaRoles.find(rolOutDTO=>rolOutDTO.rolUsuario===RolUsuarioEnum.ROLE_PLANIFICADOR);
        if(this.usuarioInDTO.lstIdRol !== null && this.usuarioInDTO.lstIdRol.includes(rolOutDTO.idRol)){
            this.esValidoGestionarProgramas=true;
        }else{
            this.esValidoGestionarProgramas=false;
        }
    }

    public onTipoIdentificacionChange():void{
        this.onNumeroIdentificacionBlur();
    }

    public onNumeroIdentificacionBlur():void{
        if(this.usuarioInDTO.numeroIdentificacion && this.usuarioInDTO.idTipoIdentificacion){
            this.usuarioServicio.consultarPersonaPorIdentificacion(this.usuarioInDTO.idTipoIdentificacion, this.usuarioInDTO.numeroIdentificacion).subscribe(
                (usuarioOutDTO: UsuarioOutDTO) => {
                    if(usuarioOutDTO){
                        this.usuarioInDTO.primerNombre = usuarioOutDTO.primerNombre;
                        this.usuarioInDTO.segundoNombre = usuarioOutDTO.segundoNombre;
                        this.usuarioInDTO.primerApellido = usuarioOutDTO.primerApellido;
                        this.usuarioInDTO.segundoApellido = usuarioOutDTO.segundoApellido;
                        this.usuarioInDTO.email = usuarioOutDTO.email;
                        this.esPersonaExistente=true;
                    }else{
                        this.usuarioInDTO.primerNombre = null;
                        this.usuarioInDTO.segundoNombre = null;
                        this.usuarioInDTO.primerApellido = null;
                        this.usuarioInDTO.segundoApellido = null;
                        this.usuarioInDTO.email = null;
                        this.esPersonaExistente=false;
                    }
                },
                (error) => {
                    console.error(error);
                }
            );  
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

    public guardar() {
        this.usuarioServicio.guardarUsuario(this.usuarioInDTO).subscribe(
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