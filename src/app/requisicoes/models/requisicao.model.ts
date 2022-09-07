import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao {
  id: string;
  funcionarioId: string;
  funcionario?: Funcionario;
  descricao: string;
  departamentoId: string;
  departamento?: Departamento;
  equipamentoId?: string;
  equipamento?: Equipamento;
  dataDeAbertura: any;
  status: string;
}
