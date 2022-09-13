import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import { Movimentacao } from "../movimentacoes/models/movimentacao.model";

export class Requisicao {
  id: string;
  descricao: string;
  dataDeAbertura: any;
  status: string;
  ultimaAtualizacao: any;

  movimentacoes: Movimentacao[];

  funcionarioId: string;
  funcionario?: Funcionario;

  departamentoId: string;
  departamento?: Departamento;

  equipamentoId?: string;
  equipamento?: Equipamento;
}
