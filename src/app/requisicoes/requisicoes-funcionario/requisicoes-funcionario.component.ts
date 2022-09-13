import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, pipe } from 'rxjs';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { Departamento } from '../../departamentos/models/departamento.model';
import { DepartamentoService } from '../../departamentos/services/departamento.service';
import { Equipamento } from '../../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../../equipamentos/services/equipamento.service';
import { FuncionarioService } from '../../funcionarios/services/funcionario.service';
import { Requisicao } from '.././models/requisicao.model';
import { RequisicaoService } from '.././services/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html'
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public funcionarioLogadoId: string;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;

  public form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private requisicoesService: RequisicaoService,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }


  ngOnDestroy(): void {
  }

  ngOnInit(): void {


    this.form = this.fb.group({
      id: new FormControl(""),
      dataDeAbertura: new FormControl(""),
      descricao: new FormControl(""),
      status: new FormControl(""),
      ultimaAtualizacao: new FormControl(""),
      

      departamentoId: new FormControl(""),
      departamento: new FormControl(""),

      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),
    }
    )

    this.obterFuncionarioLogado();

    // this.requisicoes$ = this.requisicoesService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

  }

  get id() {
    return this.form.get("id");
  }

  get dataDeAbertura() {
    return this.form.get("dataDeAbertura");
  }

  get departamentoId() {
    return this.form.get("departamentoId");
  }

  get departamento() {
    return this.form.get("departamento");
  }

  get descricao() {
    return this.form.get("descricao");
  }

  get equipamentoId() {
    return this.form.get("equipamentoId");
  }

  get equipamento() {
    return this.form.get("equipamento");
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


  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro"
  }


  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();

    this.setValoresPadrao();

    if(requisicao){
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;

     const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento,
        funcionario
      }

      this.form.get("requisicao")?.setValue(requisicaoCompleta);
    }
    try {

      await this.modalService.open(modal).result;

      if(!requisicao){

        await this.requisicoesService.inserir(this.form.value);
        this.toastr.success("Requisição inserida com sucesso!");

      }
      else{
        await this.requisicoesService.editar(this.form.value);
        this.toastr.success("Requisição editada com sucesso!");
      }


    } catch (error) {
      console.log(error);

      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Houve um erro ao salvar a requisição. Tente novamente.")

    }
  }

  public async excluir(modal: TemplateRef<any>, requisicao: Requisicao) {

    try {

      await this.modalService.open(modal).result

      this.requisicoesService.excluir(requisicao);
      this.toastr.success("Requisição excluída com sucesso!");


    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Houve um erro ao excluir a requisição. Tente novamente.")

    }

  }

  private obterFuncionarioLogado() {

    this.authService.usuarioLogado.subscribe(dados => {
      this.funcionarioService.selecionarFuncionarioLogado(dados!.email!)
        .subscribe(funcionario => {
          this.funcionarioLogadoId = funcionario.id;
          console.log(funcionario);

          this.requisicoes$ = this.requisicoesService.selecionarTodos()
          .pipe(
            map(requisicoes => {
              return requisicoes.filter(r => r.funcionarioId === funcionario.id);

            })
          )
        })
    })
  }

  private setValoresPadrao() {
    this.form.patchValue({
      funcionarioId: this.funcionarioLogadoId,
      status: "Aberto",
      dataDeAbertura: new Date(),
      ultimaAtualizacao: new Date()
    })
  }


}
