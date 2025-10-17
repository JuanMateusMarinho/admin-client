import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/usuario.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { createId } from '@paralleldrive/cuid2';
import { SUPABASE_CLIENT } from './supabase.provider';

// A interface User permanece a mesma, representando a estrutura dos seus dados.
export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient
  ) {
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

    const newId = createId(); // Gera um ID único e seguro

    // Insere o novo usuário no banco de dados
    const { data, error } = await this.supabase
      .from('users')
      .insert([{ ...createUserDto, id: newId }]) // CUID2 gera string, talvez precise ajustar o tipo no BD
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  // O ID agora pode ser uma string, dependendo da sua implementação com CUID2
  async update(id: number | string, updateUserDto: UpdateUserDto): Promise<User> {
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

  async updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Primeiro, garante que o usuário existe buscando pelo e-mail
    const userToUpdate = await this.findOneByEmail(email);

    // Se um novo e-mail estiver sendo fornecido para atualização
    if (updateUserDto.email && updateUserDto.email !== email) {
      // Verifica se o novo e-mail já está em uso por outro usuário
      const { data: existingUser } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', updateUserDto.email)
        .single();

      if (existingUser) {
        throw new BadRequestException(`O e-mail ${updateUserDto.email} já está em uso por outro usuário.`);
      }
    }

    // Atualiza o usuário usando o e-mail como critério de busca
    const { data, error } = await this.supabase
      .from('users')
      .update(updateUserDto)
      .eq('email', email)
      .select()
      .single();

    if (error) {
      // Lança uma exceção se houver um erro na atualização
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async remove(id: number | string): Promise<{ message: string, user: User }> {
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

  async findOne(id: number | string): Promise<User> {
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

  async findOneByEmail(email: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Usuário com e-mail ${email} não encontrado.`);
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
