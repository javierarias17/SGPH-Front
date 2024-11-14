import { Component, OnInit } from '@angular/core';
import { ProgramaService } from '../../../common/services/programa.service';
import { ProgramaOutDTO } from '../../../common/model/programa/out/programa.out.dto';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { PeriodoAcademicoSharedService } from 'src/app/shared/service/periodo.academico.shared.service';
import { PeriodoAcademicoOutDTO } from 'src/app/componentes/periodo-academico/gestionar-periodo-academico/model/out/periodo-academico-out-dto';
import { Message } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InformacionDetalleCargueComponent } from '../components/informacion-detalle-cargue/informacion-detalle-cargue.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cargar-labor-docencia',
  templateUrl: './cargar.labor.docencia.component.html',
  styleUrls: ['./cargar.labor.docencia.component.css'],
  providers: [DialogService],
})
export class CargarLaborDocenciaComponent implements OnInit {

	formulario: FormGroup;

	cargar: boolean = false
	eliminar: boolean = false
	listaProgramas: ProgramaOutDTO[]
	programa: ProgramaOutDTO
	isLoading: boolean = false;
	ref: DynamicDialogRef;

	public mensajesError:string = "";
	public messages: Message[] = null;

	constructor(private fb: FormBuilder,
		private programaService: ProgramaService,
		private sharedService: SharedService,
		private dialogService: DialogService,
		private messageService: ShowMessageService,
		public periodoAcademicoSharedService:PeriodoAcademicoSharedService,
		private http: HttpClient
	) {

	}
	ngOnInit(): void {
		this.inicializarFormulario(); 
		this.consultarPeriodoAcademicoVigente();
		this.cargarProgramas();
		this.limpiar();
	}

	public inicializarFormulario() {
		this.formulario = this.fb.group({
		  idPrograma: [{value: null}, Validators.required]
		})
	}

	public idPrograma(): FormControl {
		return this.formulario.get("idPrograma") as FormControl
	}

	cargarLabor() {
		this.cargar = !this.cargar
	}
	cargarProgramas() {
		this.programaService.consultarProgramasPermitidosPorUsuario().subscribe(
		(r: ProgramaOutDTO[]) => {
			this.listaProgramas = r
		},
		(error) => {
			console.error(error);
		}
		);
	}

	private limpiar() {
        this.formulario.reset();
    }

  	private consultarPeriodoAcademicoVigente():void{
		this.periodoAcademicoSharedService.consultarPeriodoAcademicoVigente().subscribe(
			(periodoAcademicoVigente: PeriodoAcademicoOutDTO) => {
				if(periodoAcademicoVigente){
					this.messages=null;
				}else{
					this.messages=[{ severity: 'error', summary: 'No existe periodo académico vigente', detail:"No podrá acceder a esta funcionalidad si no existe un periodo académico abierto." }];
				}
			},
			(error) => {
				console.error(error);
			}
		);        
	}

	guardar() {
        this.isLoading = true;
        this.http.get<any[]>('/assets/mock-labor-docente.json').subscribe(
            (docenteLaborList) => {
                this.sharedService
                    .importarLaborDocente(
                        docenteLaborList,
                        1,
                        this.idPrograma().value
                    )
                    .subscribe(
                        (response) => {
                            this.isLoading = false;
                            this.messageService.showMessage(
                                'success',
                                'Labor docente importada correctamente'
                            );

                            // Abre el modal con estado de éxito
                            this.ref = this.dialogService.open(
                                InformacionDetalleCargueComponent,
                                {
                                    header: 'Información detalle cargue',
                                    data: {
                                        facultad:
                                            'Facultad de Ingeniería Electrónica y Telecomunicaciones',
                                        programa: "Nombre del programa",
                                        estado: 'Cargado con éxito',
                                        detalleCargue: response,
                                    },
                                    width: '50%',
                                }
                            );
                        },
                        (error) => {
                            this.isLoading = false;
                            console.error('Error al importar:', error);

                            // Configura el mensaje de error
                            let mensajeError =
                                'Ocurrió un error inesperado al importar la labor docente.';
                            if (error.error && Array.isArray(error.error)) {
                                mensajeError = error.error.join('\n');
                            } else if (typeof error.error === 'string') {
                                mensajeError = error.error;
                            }

                            // Muestra el modal con estado de fallo
                            this.ref = this.dialogService.open(
                                InformacionDetalleCargueComponent,
                                {
                                    header: 'Información detalle cargue',
                                    data: {
                                        facultad:
                                            'Facultad de Ingeniería Electrónica y Telecomunicaciones',
                                        estado: 'Fallo cargue',
                                        detalleCargue: [mensajeError], // Muestra el mensaje de error en detalleCargue
                                    },
                                    width: '50%',
                                }
                            );
                        }
                    );
            },
            (error) => {
                this.isLoading = false;
                console.error('Error al cargar el archivo JSON:', error);
                this.messageService.showMessage(
                    'error',
                    'Error al cargar el archivo JSON de prueba.'
                );
            }
        );
    }

    visualizar() {
        if (this.programa) {
            const filtro = {
                idPrograma: this.programa.idPrograma,
                nombrePrograma: this.programa.nombre,
            };

            this.sharedService.obtenerVisualizarLaborDocente(filtro).subscribe(
                (response) => {
                    console.log('Respuesta de visualizar:', response);
                    this.messageService.showMessage(
                        'success',
                        'Visualización de la labor docente realizada correctamente'
                    );
                },
                (error) => {
                    console.error('Error al visualizar:', error);
                    this.messageService.showMessage(
                        'error',
                        'Error al visualizar la labor docente'
                    );
                }
            );
        } else {
            this.messageService.showMessage(
                'error',
                'Por favor, seleccione un programa'
            );
        }
    }

    mostrarInformacionDetalleCargue() {
        this.ref = this.dialogService.open(InformacionDetalleCargueComponent, {
            header: 'Información detalle cargue - Telemática',
            width: '50%',
            data: {
                facultad:
                    'Facultad de Ingeniería Electrónica y Telecomunicaciones',
                programa: 'TT - Tecnología en Telemática',
                cursosCargados: 47,
                estado: 'Cargado con éxito',
                detalleCargue: [
                    { nombre: 'Cálculo 1 Grupo A' },
                    { nombre: 'Álgebra Lineal Grupo C' },
                    // otros datos si es necesario
                ],
            },
        });
    }

}
