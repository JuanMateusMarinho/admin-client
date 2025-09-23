import { Body, Controller, Get, Param, Post, Query, BadRequestException, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { UsuarioDto } from './dto/usuario.dto';
import { ApiAllResponses } from './decorators/swaggers-decorators';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/usuario2.dto';
import { UpdateUserDto } from './dto/usuario2.dto';

@Controller('users')
export class UserController {
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
  @ApiAllResponses({summary: 'Retorna mensagem de saudação para o usuário informado',okType: String})
  getHelloParam(
    @Param('nome') nome: string,
    @Query('senha') senha: string,
  ): string {
    return this.appService.getHelloParam(nome, senha);
  }  

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'O usuário foi criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos.' })
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log('Dados recebidos para criar usuário:', createUserDto);
    return {message: 'Usuário criado com sucesso!',data: createUserDto};  
 }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Atualiza um usuário existente' })
  @ApiResponse({ status: 200, description: 'O usuário foi atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(`Atualizando usuário com ID: ${id}`);
    console.log('Dados para atualização:', updateUserDto);
    return {message: `Usuário com ID ${id} atualizado.`, data: updateUserDto};
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({ summary: 'Deleta um usuário' })
  @ApiResponse({ status: 204, description: 'O usuário foi deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  deleteUser(@Param('id') id: string) {
    console.log(`Deletando usuário com ID: ${id}`);
    return {message: `Usuário com ID ${id} deletado.`};
  }
}
