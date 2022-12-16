import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>
  ) {}
  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
    }

    return await this.criar(criarJogadorDto);
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: AtualizarJogadorDto
  ): Promise<void> {
    const idValido = Types.ObjectId.isValid(_id);
    const jogadorEncontrado = idValido
      ? await this.jogadorModel.findOne({ _id }).exec()
      : null;

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    await this.atualizar(_id, atualizarJogadorDto);
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    this.logger.log(`jogadorCriado: ${JSON.stringify(jogadorCriado)}`);

    return await jogadorCriado.save();
  }

  private async atualizar(
    id: string,
    atualizarJogadorDto: AtualizarJogadorDto
  ): Promise<Jogador> {
    this.logger.log(`jogadorAtualizado: ${JSON.stringify(id)}`);

    return await this.jogadorModel
      .findOneAndUpdate({ _id: id }, { $set: atualizarJogadorDto })
      .exec();
  }

  async deletarJogador(id: string): Promise<any> {
    const idValido = Types.ObjectId.isValid(id);
    const jogadorEncontrado = idValido
      ? await this.jogadorModel.findById(id).exec()
      : null;

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${id} não encontrado`);
    }
    return this.jogadorModel.deleteOne({ id }).exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    const idValido = Types.ObjectId.isValid(_id);
    const jogadorEncontrado = idValido
      ? await this.jogadorModel.findOne({ _id }).exec()
      : null;

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com email ${email} não encontrado`);
    }

    return jogadorEncontrado;
  }
}
