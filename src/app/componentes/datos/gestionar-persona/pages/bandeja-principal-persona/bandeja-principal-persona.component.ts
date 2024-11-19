import { Component } from '@angular/core';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { PersonaService } from 'src/app/componentes/common/services/persona.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TipoIdentificacionOutDTO } from 'src/app/componentes/seguridad/gestionar-usuario/model/out/tipo.identificacion.out.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { CrearEditarPersonaComponent } from '../../components/crear-editar-consultar-eliminar-persona/crear.editar.consultar.eliminar.persona';
import { PersonaOutDTO } from '../../model/out/persona.out.dto';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'bandeja-principal-persona',
  templateUrl: './bandeja-principal-persona.component.html',
  providers: [ConfirmationService, DialogService, ShowMessageService]
})
export class BandejaPrincipalPersonaComponent {
  personas: any[] = [];
    totalRecords: number;
    cargando: boolean = false;

    listaTiposIdentificacion: any[] = [];
    tipoIdentificacionSeleccionado: any;
    numeroIdentificacion: string;
    email: string = '';

    public numeroIdentificacionSubject = new Subject<string>();
    public emailSubject = new Subject<string>();


    constructor(
        private personaService: PersonaService,
        private showMessageService: ShowMessageService,
        private dialogService: DialogService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit(): void {
        this.cargarTiposIdentificacion();
        this.listarPersonasBase();

        this.numeroIdentificacionSubject.pipe(debounceTime(300)).subscribe({
            next: () => this.buscarPorIdentificacion(),
          });
        
          this.emailSubject.pipe(debounceTime(300)).subscribe({
            next: () => this.buscarPorEmail(),
          });
    }

    cargarTiposIdentificacion(): void {
      this.personaService.consultarTiposIdentificacion().subscribe({
        next: (data: TipoIdentificacionOutDTO[]) => {
          this.listaTiposIdentificacion = data;
        },
        error: (err) => {
          console.error('Error al cargar tipos de identificación', err);
        }
      });
    }  
  
    listarPersonasBase() {
      this.cargando = true;
      this.personaService.consultarPersonasPaginadas(0, 10).subscribe({
        next: (data) => {
          this.personas = data.content;
          this.totalRecords = data.totalElements;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al listar personas', err);
          this.cargando = false;
        }
      });
    }
  
    listarPersonas(event: LazyLoadEvent) {
      this.cargando = true;
      const page = Math.floor(event.first / event.rows);
      this.personaService.consultarPersonasPaginadas(page, event.rows).subscribe({
        next: (data) => {
          this.personas = data.content;
          this.totalRecords = data.totalElements;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al listar personas', err);
          this.cargando = false;
        }
      });
    }
  
    registrarPersona(): void {
      const ref = this.dialogService.open(CrearEditarPersonaComponent, {
        header: 'Registrar Persona',
        width: '600px',
        closable: false,
        data: { lectura: false },
      });
    }
    
  
    editarPersona(idPersona: number): void {
      const ref = this.dialogService.open(CrearEditarPersonaComponent, {
        height: 'auto',
            width: '800px',
            header: 'Editar Persona',
            closable: false,
            data: {
                id: idPersona,
                lectura: false,
            },
        });
        ref.onClose.subscribe((r) => {
            this.listarPersonasBase();
        });
    }
  
    verPersona(idPersona: number): void {
        const ref = this.dialogService.open(CrearEditarPersonaComponent, {
            height: 'auto',
            width: '800px',
            header: 'Información asignatura',
            closable: false,
            data: {
                id: idPersona,
                lectura: true,
            },
        });
    }

    eliminarPersona(idPersona: number): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar esta persona?',
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Realiza la eliminación al aceptar la confirmación
                this.personaService.eliminarPersona(idPersona).subscribe({
                    next: () => {
                        this.showMessageService.showMessage('success', 'Persona eliminada correctamente');
                        this.listarPersonasBase(); // Actualiza la tabla después de la eliminación
                    },
                    error: (err) => {
                        console.error('Error al eliminar la persona:', err);
                        this.showMessageService.showMessage('error', 'Error al eliminar la persona');
                    }
                });
            },
            reject: () => {
                this.showMessageService.showMessage('info', 'Eliminación cancelada');
            }
        });
    }

    buscarPorIdentificacion(): void {
        if (!this.tipoIdentificacionSeleccionado || !this.numeroIdentificacion) {
          this.listarPersonasBase(); 
          return;
        }
      
        this.cargando = true;
        this.personaService
          .consultarPersonaPorIdentificacion(this.tipoIdentificacionSeleccionado.idTipoIdentificacion, this.numeroIdentificacion)
          .subscribe({
            next: (persona) => {
              this.personas = [
                {
                  ...persona,
                  tipoIdentificacion: {
                    codigoTipoIdentificacion: persona.codigoTipoIdentificacion,
                    idTipoIdentificacion: persona.idTipoIdentificacion,
                  },
                },
              ];
              this.totalRecords = 1;
              this.cargando = false;
            },
            error: (err) => {
              console.error('Error al buscar persona por identificación', err);
              this.personas = [];
              this.totalRecords = 0;
              this.cargando = false;
            },
          });
      }
      
      
      buscarPorEmail(): void {
        if (!this.email) {
          this.listarPersonasBase();
          return;
        }
      
        this.cargando = true;
        this.personaService.consultarPersonaPorEmail(this.email).subscribe({
          next: (persona) => {
            this.personas = [
              {
                ...persona,
                tipoIdentificacion: {
                  codigoTipoIdentificacion: persona.codigoTipoIdentificacion,
                  idTipoIdentificacion: persona.idTipoIdentificacion,
                },
              },
            ];
            this.totalRecords = 1;
            this.cargando = false;
          },
          error: (err) => {
            console.error('Error al buscar persona por email', err);
            this.personas = [];
            this.totalRecords = 0;
            this.cargando = false;
          },
        });
      }
      
      
}
