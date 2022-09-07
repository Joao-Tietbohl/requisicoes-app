import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      numeroDeSerie: new FormControl("", [Validators.required, Validators.minLength(3)]),
      nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
      preco: new FormControl("", [Validators.required, Validators.min(1)]),
      dataFabricacao: new FormControl("", [Validators.required]),
    })
  }

  get id() {
    return this.form.get("id");
  }

  get numeroDeSerie() {
    return this.form.get("numeroDeSerie");
  }

  get nome() {
    return this.form.get("nome");
  }

  get preco() {
    return this.form.get("preco");
  }

  get dataFabricacao() {
    return this.form.get("dataFabricacao");
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro"
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();

    if(equipamento) {
      this.form.setValue(equipamento);
    }
    try {

      await this.modalService.open(modal).result;

      if(!equipamento){
        await this.equipamentoService.inserir(this.form.value);
        this.toastr.success("Equipamento inserido com sucesso!");
      }
      else
      {
        await this.equipamentoService.editar(this.form.value);
        this.toastr.success("Equipamento editado com sucesso!");
      }
        console.log(`O equipamento foi salvo com sucesso`);


    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Houve um erro ao salvar o equipamento. Tente novamente.")

    }
  }

  public async excluir(modal: TemplateRef<any>, equipamento: Equipamento) {

    try {

      await this.modalService.open(modal).result

      this.equipamentoService.excluir(equipamento);
      this.toastr.success("Equipamento excluído com sucesso!");


    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastr.error("Houve um erro ao excluir o equipamento. Tente novamente.")
    }

  }

}
