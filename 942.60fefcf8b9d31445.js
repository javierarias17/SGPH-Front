"use strict";(self.webpackChunksakai_ng=self.webpackChunksakai_ng||[]).push([[942],{6942:(p,i,o)=>{o.r(i),o.d(i,{DocumentationModule:()=>c});var r=o(6814),s=o(7586),e=o(8926);let u=(()=>{class t{static#e=this.\u0275fac=function(n){return new(n||t)};static#t=this.\u0275cmp=e.Xpm({type:t,selectors:[["ng-component"]],decls:94,vars:0,consts:[[1,"card","mb-3"],[1,"app-code"],[1,"font-semibold"],[1,"text-primary","font-medium"],[1,"video-container"],["width","560","height","315","src","https://www.youtube.com/embed/yl2f8KKY204","frameborder","0","allowfullscreen",""],["href","https://www.youtube.com/watch?v=5VOuUdDXRsE",1,"font-medium","text-primary","hover:underline"]],template:function(n,m){1&n&&(e.TgZ(0,"div",0)(1,"div")(2,"h2"),e._uU(3,"Documentation"),e.qZA(),e.TgZ(4,"h4"),e._uU(5,"Getting Started"),e.qZA(),e.TgZ(6,"p"),e._uU(7,"Sakai is an application template for Angular and is distributed as a CLI project. Current versions is Angular v16 with PrimeNG v16. In case CLI is not installed already, use the command below to set it up."),e.qZA(),e.TgZ(8,"pre",1)(9,"code"),e._uU(10,"npm install -g @angular/cli"),e.qZA()(),e.TgZ(11,"p"),e._uU(12,'Once CLI is ready in your system, extract the contents of the zip file distribution, cd to the directory, install the libraries from npm and then execute "ng serve" to run the application in your local environment.'),e.qZA(),e.TgZ(13,"pre",1)(14,"code"),e._uU(15,"cd sakai\nnpm install\nng serve"),e.qZA()(),e.TgZ(16,"p"),e._uU(17,"The application should run at "),e.TgZ(18,"span",2),e._uU(19,"http://localhost:4200/"),e.qZA(),e._uU(20,", you may now start with the development of your application."),e.qZA(),e.TgZ(21,"h5"),e._uU(22,"Important CLI Commands"),e.qZA(),e.TgZ(23,"p"),e._uU(24,"Following commands are derived from CLI."),e.qZA(),e.TgZ(25,"pre",1)(26,"code"),e._uU(27,"Run 'ng serve' for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.\n\nRun 'ng generate component component-name' to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.\n\nRun 'ng build' to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.\n\nRun 'ng test' to execute the unit tests via [Karma](https://karma-runner.github.io).\n\nRun 'ng e2e' to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).\n\nRun 'ng help' for more options."),e.qZA()(),e.TgZ(28,"h4"),e._uU(29,"Structure"),e.qZA(),e.TgZ(30,"p"),e._uU(31,"Sakai consists of 3 main parts; the application layout, layout assets and PrimeNG component theme assets. Layout is placed inside the "),e.TgZ(32,"span",3),e._uU(33,"src/app/layout"),e.qZA(),e._uU(34," folder, and the assets are in the "),e.TgZ(35,"span",3),e._uU(36,"src/assets/layout"),e.qZA(),e._uU(37," folder. "),e.qZA(),e.TgZ(38,"h5"),e._uU(39,"Default Configuration"),e.qZA(),e.TgZ(40,"p"),e._uU(41,"Initial layout configuration can be defined at the main app component by injecting the "),e.TgZ(42,"span",3),e._uU(43,"LayoutService"),e.qZA(),e._uU(44,", this step is optional and only necessary when customizing the defaults. Note that "),e.TgZ(45,"span",3),e._uU(46,"theme"),e.qZA(),e._uU(47," and "),e.TgZ(48,"span",3),e._uU(49,"scale"),e.qZA(),e._uU(50," are not reactive since theme is configured outside of Angular at "),e.TgZ(51,"strong",2),e._uU(52,"index.html"),e.qZA(),e._uU(53," by default and initial scale is defined with the "),e.TgZ(54,"span",3),e._uU(55,"$scale"),e.qZA(),e._uU(56," at "),e.TgZ(57,"strong",2),e._uU(58,"layout.scss"),e.qZA(),e._uU(59,". When default theme or scale is changed at their files initially, it is required to configure the layout service with the matching values to avoid sync issues. "),e.qZA(),e.TgZ(60,"pre",1)(61,"code"),e._uU(62,"import { Component, OnInit } from '@angular/core';\nimport { PrimeNGConfig } from 'primeng/api';\nimport { LayoutService } from './layout/service/app.layout.service';\n\n@Component({\n    selector: 'app-root',\n    templateUrl: './app.component.html'\n})\nexport class AppComponent implements OnInit {\n\n    constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService) { }\n\n    ngOnInit(): void {\n        this.primengConfig.ripple = true;       //enables core ripple functionality\n\n        //optional configuration with the default configuration\n        this.layoutService.config = {\n            ripple: false,                      //toggles ripple on and off\n            inputStyle: 'outlined',             //default style for input elements\n            menuMode: 'static',                 //layout mode of the menu, valid values are \"static\" and \"overlay\"\n            colorScheme: 'light',               //color scheme of the template, valid values are \"light\" and \"dark\"\n            theme: 'lara-light-indigo',         //default component theme for PrimeNG\n            scale: 14                           //size of the body font size to scale the whole application\n        };\n    }\n\n}"),e.qZA()(),e.TgZ(63,"h5"),e._uU(64,"Menu"),e.qZA(),e.TgZ(65,"p"),e._uU(66,"Menu is a separate component defined in "),e.TgZ(67,"span",3),e._uU(68,"src/app/layout/app.menu.component.ts"),e.qZA(),e._uU(69," file and based on PrimeNG MenuModel API. In order to define the menuitems, navigate to this file and define your own model as a nested structure."),e.qZA(),e.TgZ(70,"pre",1)(71,"code"),e._uU(72,"import { OnInit } from '@angular/core';\nimport { Component } from '@angular/core';\n\n@Component({\n    selector: 'app-menu',\n    templateUrl: './app.menu.component.html'\n})\nexport class AppMenuComponent implements OnInit {\n\n    model: any[] = [];\n\n    ngOnInit() {\n        this.model = [\n            {\n                label: 'Home',\n                items: [\n                    {\n                        label: 'Dashboard',\n                        icon: 'pi pi-fw pi-home',\n                        routerLink: ['/']\n                    }\n                ]\n            },\n            //...\n        ];\n    }\n}"),e.qZA()(),e.TgZ(73,"h4"),e._uU(74,"Integration with Existing Angular CLI Projects"),e.qZA(),e.TgZ(75,"p"),e._uU(76,"Sakai structure is designed in a modular way so that it can easily be integrated with your existing application. We've created a short tutorial with details."),e.qZA(),e.TgZ(77,"div",4),e._UZ(78,"iframe",5),e.qZA(),e.TgZ(79,"h4"),e._uU(80,"Theme"),e.qZA(),e.TgZ(81,"p"),e._uU(82,"Sakai provides 34 PrimeNG themes out of the box. Setup of a theme is simple by including the css of theme to your bundle that are located inside "),e.TgZ(83,"span",3),e._uU(84,"assets/layout/styles/theme/"),e.qZA(),e._uU(85," folder such as "),e.TgZ(86,"span",3),e._uU(87,"assets/layout/styles/theme/lara-light-indigo/theme.css"),e.qZA(),e._uU(88,"."),e.qZA(),e.TgZ(89,"p"),e._uU(90,"Another alternative would be creating dynamic bundles, please see the "),e.TgZ(91,"a",6),e._uU(92,"video tutorial"),e.qZA(),e._uU(93," for an example."),e.qZA()()())},styles:["@media screen and (max-width: 991px){.video-container[_ngcontent-%COMP%]{position:relative;width:100%;height:0;padding-bottom:56.25%}.video-container[_ngcontent-%COMP%]   iframe[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%}}"]})}return t})(),l=(()=>{class t{static#e=this.\u0275fac=function(n){return new(n||t)};static#t=this.\u0275mod=e.oAB({type:t});static#n=this.\u0275inj=e.cJS({imports:[s.Bz.forChild([{path:"",component:u}]),s.Bz]})}return t})(),c=(()=>{class t{static#e=this.\u0275fac=function(n){return new(n||t)};static#t=this.\u0275mod=e.oAB({type:t});static#n=this.\u0275inj=e.cJS({imports:[r.ez,l]})}return t})()}}]);