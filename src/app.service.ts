import { BadRequestException, Injectable } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';

@Injectable()
export class AppService {
  getHello(body: UsuarioDto): string {
    return `Hello ${body.primeiroUsuario} , ${body.segundoUsuario} e ${body.terceiroUsuario}!`;
  }
  getHelloParam(nome: string, senha: string): string {
    const nomeRegex = /^[\p{L}\s]+$/u;
    const senhaRegex = /^(?!.*(\d)\1\1)\d{6}$/;
    
    if (!nomeRegex.test(nome) || !senhaRegex.test(senha)) {
      throw new BadRequestException('Nome ou senha inválidos. Nome: apenas letras e espaços. Senha: 6 dígitos, sem 3 iguais seguidos.');
    }

    return `Hello ${nome}!`; 
  }
}
      

    

