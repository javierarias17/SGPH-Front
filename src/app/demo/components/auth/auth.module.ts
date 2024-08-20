import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptores } from 'src/app/shared/http.interceptor';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
    ]})
export class AuthModule { }
