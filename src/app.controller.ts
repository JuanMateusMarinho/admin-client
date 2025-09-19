import { Body, Controller, Get, Param, Post, Query, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { UsuarioDto } from './dto/usuario.dto';
import { ApiAllResponses } from './decorators/swaggers-decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("api/teste")
  @ApiAllResponses({
    summary: 'Retorna mensagem de saudação para os usuários informados',
    bodyType: UsuarioDto,
    bodyDescription: 'Usuários a serem saudados',
    okType: String,
  })
  getHello(@Body() body: UsuarioDto): string {
    return this.appService.getHello(body);
  }

  @Get('api/usuario/:nome')
  @ApiAllResponses({
    summary: 'Retorna mensagem de saudação para o usuário informado',
    okType: String
  })
  getHelloParam(
    @Param('nome') nome: string,
    @Query('senha') senha: string,
  ): string {
    return this.appService.getHelloParam(nome, senha);
  }  
}
