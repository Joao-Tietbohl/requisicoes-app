import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { Movimentacao } from '../movimentacoes/models/movimentacao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html'
})
export class RequisicoesDepartamentoComponent implements OnInit {

  public funcionarioLogado: Funcionario;
  public departamentoFuncionarioLogadoId: string;
  public requisicaoSelecionada: Requisicao;
  public listaStatus: string[] = ["Aberta", "Processando", "Não Autorizada", "Fechada"];

  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>
  public form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private requisicaoService: RequisicaoService,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      descricao: new FormControl("", Validators.required),
      status: new FormControl("", [Validators.required]),
      dataCriacao: new FormControl("")
    })

    this.obterFuncionarioLogado();
  }


  get id() {
    return this.form.get("id");
  }

  get dataCriacao() {
    return this.form.get("dataDeAbertura");
  }

  get descricao() {
    return this.form.get("descricao");
  }

  get status() {
    return this.form.get("status");
  }

  get funcionarioId() {
    return this.form.get("funcionarioId");
  }

  get funcionario() {
    return this.form.get("funcionario");
  }

  public async gravar(modal: TemplateRef<any>, requisicao: Requisicao) {
    this.requisicaoSelecionada = requisicao;
    this.requisicaoSelecionada.movimentacoes = requisicao.movimentacoes ? requisicao.movimentacoes : [];

    this.form.reset();
    this.setValoresPadrao();


    try {

      await this.modalService.open(modal).result;

      this.atualizarRequisicao(this.form.value);
      await this.requisicaoService.editar(this.requisicaoSelecionada)

      this.toastr.success("A requisição foi salva com sucesso")

    } catch (error) {
      console.log(error);

      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Houve um erro ao salvar a requisição. Tente novamente.")

    }
  }

  private atualizarRequisicao(movimentacao: Movimentacao) {
    movimentacao.funcionario = this.funcionarioLogado;
    this.requisicaoSelecionada.movimentacoes.push(movimentacao);
    this.requisicaoSelecionada.status = this.status?.value;
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
  }

  private setValoresPadrao() {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      dataCriacao: new Date(),
      status: this.requisicaoSelecionada.status
    })
  }

  private obterFuncionarioLogado() {

    this.authService.usuarioLogado.subscribe(dados => {
      this.funcionarioService.selecionarFuncionarioLogado(dados!.email!)
        .subscribe(funcionario => {
          this.funcionarioLogado = funcionario;

          this.requisicoes$ = this.requisicaoService.SelecionarRequisicoesDepartamentoPorId(funcionario.departamentoId)

        })
    })
  }
}
