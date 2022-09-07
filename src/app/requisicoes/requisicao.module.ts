import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequisicaoComponent } from './requisicao.component';


@NgModule({
  declarations: [
    RequisicaoComponent
  ],
  imports: [
    CommonModule,
    RequisicaoRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class RequisicaoModule { }
