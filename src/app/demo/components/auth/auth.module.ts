import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginStudentComponent } from './login-student/login.student/login.student.component';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
    ],
    declarations: [
    ]})
export class AuthModule { }
