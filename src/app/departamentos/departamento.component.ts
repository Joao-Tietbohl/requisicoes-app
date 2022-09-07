import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamento.model';
import { DepartamentoService } from './services/departamento.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
})
export class DepartamentoComponent implements OnInit {
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private departamentoService: DepartamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {

  }

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
      telefone: new FormControl("", [Validators.required])
    })
  }

  get nome() {
    return this.form.get("nome");
  }

  get telefone() {
    return this.form.get("telefone");
  }

  get id() {
    return this.form.get("id");
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro"
  }

  public async gravar(modal: TemplateRef<any>, departamento?: Departamento) {
    this.form.reset();

    if(departamento) {
      this.form.setValue(departamento);
    }
    try {

      await this.modalService.open(modal).result;

      if(!departamento){
        await this.departamentoService.inserir(this.form.value);
        this.toastr.success("Departamento inserido com sucesso!");
      }
      else{
        await this.departamentoService.editar(this.form.value);
        this.toastr.success("Departamento editado com sucesso!");
      }
        console.log(`O departamento foi salvo com sucesso`);


    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Houve um erro ao salvar o departamento. Tente novamente.")

    }
  }

  public async excluir(modal: TemplateRef<any>, departamento: Departamento) {

    try {

      await this.modalService.open(modal).result

      this.departamentoService.excluir(departamento);
      this.toastr.success("Departamento excluído com sucesso!");


    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Houve um erro ao excluir o departamento. Tente novamente.")

    }

  }

}
