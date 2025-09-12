import { Injectable } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';

@Injectable()
export class AppService {
  getHello(body: UsuarioDto): string {
    return `Hello ${body.primeiroUsuario} e ${body.segundoUsuario}!`;
  }
}
