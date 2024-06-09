import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/componentes/servicios/login.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {

    valCheck: string[] = ['remember'];
    formulario: FormGroup

    constructor(public layoutService: LayoutService,
        private loginService: LoginService,
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.inicializarFormulario()
    }
    inicializarFormulario() {
        this.formulario = this.fb.group({
            correo: ["", Validators.required],
            password: [null, Validators.required]
        })
    }
    async iniciarSesion() {
        if (this.formulario.valid) {
            this.loginService.getLogin(this.correo().value, this.password().value).toPromise().then((response) => {
                this.router.navigate(["/"])
            }).catch(() => { 
                this.messageService.add({
                    severity: "error",
                    detail: "Credenciales incorrectas"
                })
             })
        } else {
            this.formulario.markAllAsTouched()
            this.formulario.markAsDirty()
        }

    }

    correo(): FormControl {
        return this.formulario.get("correo") as FormControl
    }
    password(): FormControl {
        return this.formulario.get("password") as FormControl
    }
}
