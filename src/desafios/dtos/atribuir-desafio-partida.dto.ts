/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import { Resultado } from '../interfaces/desafio.interface';
import { Jogador } from '../../jogadores/interfaces/jogador.interface';

export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}
