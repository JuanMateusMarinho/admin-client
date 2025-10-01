import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/usuario.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.provider';

// A interface User permanece a mesma, representando a estrutura dos seus dados.
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient
  ) {
  }

  private generateRandomId(): number {
    return Math.floor(10000 + Math.random() * 90000);
  }

  private isSequential(id: number): boolean {
    const s = id.toString();
    let isAscending = true;
    let isDescending = true;

    for (let i = 0; i < s.length - 1; i++) {
      if (+s[i + 1] !== +s[i] + 1) {
        isAscending = false;
      }
      if (+s[i + 1] !== +s[i] - 1) {
        isDescending = false;
      }
    }
    return isAscending || isDescending;
  }

  private async generateAndCheckId(): Promise<number> {
    // Loop infinito que só será interrompido por um "return"
    while (true) {
      const id = this.generateRandomId();
      if (!this.isSequential(id)) {
        const { data: existingId } = await this.supabase.from('users').select('id').eq('id', id).single();
        if (!existingId) {
          return id;
        }
      }
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verifica se já existe um usuário com o mesmo e-mail
    const { data: existingUser, error: existingUserError } = await this.supabase
      .from('users')
      .select('email')
      .eq('email', createUserDto.email)
      .single();

    if (existingUser) {
      throw new BadRequestException(`Já existe um usuário com o e-mail ${createUserDto.email}.`);
    }

    const newId = await this.generateAndCheckId();

    // Insere o novo usuário no banco de dados
    const { data, error } = await this.supabase
      .from('users')
      .insert([{ ...createUserDto, id: newId }])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Primeiro, garante que o usuário existe
    await this.findOne(id);

    // Se o e-mail estiver sendo atualizado, verifica se o novo e-mail já está em uso por outro usuário
    if (updateUserDto.email) {
      const { data: existingUser, error: existingUserError } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', updateUserDto.email)
        .neq('id', id) // Exclui o próprio usuário da verificação
        .single();

      if (existingUser) {
        throw new BadRequestException(`O e-mail ${updateUserDto.email} já está em uso por outro usuário.`);
      }
    }

    // Atualiza o usuário
    const { data, error } = await this.supabase
      .from('users')
      .update(updateUserDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async remove(id: number): Promise<{ message: string, user: User }> {
    // Busca o usuário para poder retorná-lo na mensagem de sucesso
    const deletedUser = await this.findOne(id);

    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: `Usuário ${deletedUser.name} deletado com sucesso.`, user: deletedUser };
  }

  async findOne(id: number): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return data;
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabase.from('users').select('*');
    if (error) {
      throw new BadRequestException(error.message);
    }
    return data || [];
  }
}
