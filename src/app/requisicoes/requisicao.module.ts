import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequisicaoComponent } from './requisicao.component';
import { RequisicoesFuncionarioComponent } from './requisicoes-funcionario/requisicoes-funcionario.component';
import { RequisicoesDepartamentoComponent } from './requisicoes-departamento/requisicoes-departamento.component';
import { MovimentacaoComponent } from './movimentacoes/movimentacao.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { RequisicaoDetalhesComponent } from './detalhes/requisicao-detalhes/requisicao-detalhes.component';


@NgModule({
  declarations: [
    RequisicaoComponent,
    RequisicoesFuncionarioComponent,
    RequisicoesDepartamentoComponent,
    MovimentacaoComponent,
    DetalhesComponent,
    RequisicaoDetalhesComponent
  ],
  imports: [
    CommonModule,
    RequisicaoRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class RequisicaoModule { }
