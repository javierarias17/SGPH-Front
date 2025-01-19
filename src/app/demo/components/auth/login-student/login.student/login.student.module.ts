import { NgModule } from "@angular/core";
import { LoginStudentComponent } from "./login.student.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";

@NgModule({
    declarations: [LoginStudentComponent],
    imports: [
      CommonModule,
      FormsModule,
      ButtonModule,
    ]
  })
  export class LoginStudentModule { }