import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EspacioFisicoOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/espacio.fisico.out.dto';
import { AgrupacionPorFacultad } from '../../../gestionar-asignatura/model/agrupacion-por-facultad';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UbicacionOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/ubicacion.out.dto';
import { EdificioOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/edificio.out.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { TipoEspacioFisicoOutDTO } from 'src/app/componentes/datos/gestionar-espacio-fisico/model/out/tipo.espacio.fisico.out.dto';
import { EspacioFisicoService } from 'src/app/componentes/common/services/espacio.fisico.service';

@Component({
  selector: 'app-crear-editar-espacio-fisico',
  templateUrl: './crear-editar-espacio-fisico.component.html',
  styleUrls: ['./crear-editar-espacio-fisico.component.scss']
})
export class CrearEditarEspacioFisicoComponent implements OnInit {
  espacio: EspacioFisicoOutDTO = {} as EspacioFisicoOutDTO
  agrupadoresLectura: AgrupacionPorFacultad[]
  lectura: boolean
  formulario: FormGroup
  ubicaciones: UbicacionOutDTO[]
  edificios: EdificioOutDTO[]
  estados: string[] = ['ACTIVO', 'INACTIVO']
  recursosLista: any[] = []
  gruposSeleccionados: number[]
  lstTipoEspacioFisicoOutDTO: TipoEspacioFisicoOutDTO[] = [];
  recursosActuales: any[]
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private espacioFisicoService: EspacioFisicoService,
    private fb: FormBuilder,
    private messageService: ShowMessageService,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerUbicaciones()
    this.obtenerRecursos()
    this.obtenerTipos()
    this.lectura = this.config.data?.lectura
    if (this.config.data?.idEspacioFisico) {
      this.infoEspacioFisico()
    }
  }
  obtenerUbicaciones() {
    this.espacioFisicoService.consultarUbicaciones().subscribe((r) => {
        this.ubicaciones = r;
        if (this.espacio.idUbicacion) {
            // Asigna el valor de idUbicacion al formulario
            this.idUbicacion().setValue(this.espacio.idUbicacion);
        }
    });
 }

  obtenerEdificios() {
    const ubicacionSeleccionada = this.idUbicacion().value;
    if (ubicacionSeleccionada) {
        this.espacioFisicoService
            .consultarEdificiosPorUbicacion([ubicacionSeleccionada])
            .subscribe((edificios) => {
                this.edificios = edificios;
                // Verifica si hay un edificio seleccionado y lo asignas al formulario
                if (this.espacio.idEdificio) {
                    this.idEdificio().setValue(this.espacio.idEdificio);
                }
            });
    }
  }
  
  obtenerRecursos() {
    this.espacioFisicoService.obtenerListaRecursos().subscribe(r => this.recursosLista = r)
  }

  onChangeUbicacion() {
    if (this.idUbicacion().value) {
      this.obtenerEdificios()

    }
  }

  obtenerTipos() {
    this.espacioFisicoService.consultarTiposEspaciosFisicos().subscribe(
        (tiposEspacioFisico: TipoEspacioFisicoOutDTO[]) => {
            this.lstTipoEspacioFisicoOutDTO = tiposEspacioFisico || [];
            if (this.espacio.idTipoEspacioFisico) {
                this.tipo().setValue(this.espacio.idTipoEspacioFisico);
            }
        },
        (error) => {
            console.error('Error al cargar tipos de espacio físico:', error);
        }
    );
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      idUbicacion: ['', Validators.required],
      idEdificio: [''], // Remueve Validators.required si no es obligatorio
      salon: ['', Validators.required],
      estado: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      tipo: ['', Validators.required],
      OID: ['', Validators.required],
      recursos: ['', Validators.required],
    });
  }
  
  
  infoEspacioFisico() {
    this.espacioFisicoService
        .consultarEspacioFisicoPorIdEspacioFisico(this.config.data.idEspacioFisico)
        .subscribe((r) => {
            this.espacio = r;
            if (r) {
                this.recursosActuales = r.recursos;
                this.setFormulario();
                this.obtenerEdificios(); // Cargar los edificios relacionados con la ubicación
            }
        });
  }

  setFormulario() {
    this.formulario.patchValue({
        idUbicacion: this.espacio.idUbicacion || null,
        idEdificio: this.espacio.idEdificio || null,
        salon: this.espacio.salon || '',
        estado: this.espacio.estado || '',
        capacidad: this.espacio.capacidad || '',
        tipo: this.espacio.idTipoEspacioFisico || null,
        OID: this.espacio.OID || '',
        recursos: this.espacio.recursos?.map(r => r.idRecurso) || [],
    });

    // Deshabilitar los campos no editables
    this.idUbicacion().disable();
    this.salon().disable();
  }


  agrupadores() {
    const agrupacionPorFacultad: AgrupacionPorFacultad[] = this.espacio.lstIdAgrupadorEspacioFisico.reduce((acc: AgrupacionPorFacultad[], agrupador) => {
      const existingGroup = acc.find(group => group.idFacultad === agrupador.idFacultad);
      if (existingGroup) {
          existingGroup.agrupadorDTOs.push(agrupador);
      } else {
          acc.push({ idFacultad: agrupador.idFacultad, nombreFacultad: agrupador.nombreFacultad, agrupadorDTOs: [agrupador] });
      }
      return acc;
    }, []);
    this.agrupadoresLectura = agrupacionPorFacultad
  }


  salir() {
    this.ref.close()
  }

  guardar() {
    console.log("Método guardar invocado");
    console.log("Formulario válido:", this.formulario.valid);
    if (this.formulario.valid) {
        const espacioSave: EspacioFisicoOutDTO = {
            ...this.formulario.value,
            idEspacioFisico: this.espacio?.idEspacioFisico,
            idEdificio: this.idEdificio().value || null, 
            idTipoEspacioFisico: this.tipo().value || null,
            OID: this.OID().value,
            esValidar: false,
        };

        console.log("Datos a guardar:", espacioSave);
        this.espacioFisicoService.guardarEspacioFisico(espacioSave).subscribe({
            next: (response) => {
                this.messageService.showMessage("success", "Espacio físico guardado correctamente");
                this.ref.close();
            },
            error: (err) => {
                console.error("Error al guardar el espacio físico:", err);
                this.messageService.showMessage("error", "Error al guardar el espacio físico.");
            },
        });
    } else {
        console.log("Errores en el formulario:", this.formulario.errors);
        this.formulario.markAllAsTouched();
    }
  }
  
  getAgrupadoresSeleccionados(r: number[]) {
    console.log(r)
    this.gruposSeleccionados = r
  }
  idUbicacion(): FormControl {
    return this.formulario.get('idUbicacion') as FormControl
   }
   idEdificio(): FormControl {
    return this.formulario.get('idEdificio') as FormControl
   }
   salon(): FormControl {
    return this.formulario.get('salon') as FormControl
   }
   estado(): FormControl {
    return this.formulario.get('estado') as FormControl
   }
   capacidad(): FormControl {
    return this.formulario.get('capacidad') as FormControl
   }
   recursos(): FormControl {
    return this.formulario.get('recursos') as FormControl
   }
   tipo(): FormControl {
    return this.formulario.get('tipo') as FormControl
   }
   OID(): FormControl {
    return this.formulario.get('OID') as FormControl
   }
}
