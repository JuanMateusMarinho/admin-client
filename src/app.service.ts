import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/usuario.dto';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  private users: User[] = [];
  private nextId = 1;

  create(createUserDto: CreateUserDto): User {
    const userWithSameEmail = this.users.find(user => user.email === createUserDto.email);
    if (userWithSameEmail) {
      throw new BadRequestException(`Já existe um usuário com o e-mail ${createUserDto.email}.`);
    }

    const newUser: User = {
      id: this.nextId++,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    if (updateUserDto.email) {
      const userWithSameEmail = this.users.find(
        user => user.email === updateUserDto.email && user.id !== id
      );
      if (userWithSameEmail) {
        throw new BadRequestException(`O e-mail ${updateUserDto.email} já está em uso por outro usuário.`);
      }
    }

    const user = this.findOne(id);
    Object.assign(user, { name: updateUserDto.name ?? user.name, email: updateUserDto.email ?? user.email });
    return user;
  }

  remove(id: number): void {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    this.users.splice(userIndex, 1);
  }

  findOne(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  findAll(): User[] {
    return this.users;
  }
}
