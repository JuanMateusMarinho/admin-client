import { Body, Controller, Get, Param, Post, Query, BadRequestException, Patch, Delete, HttpCode, HttpStatus, ParseIntPipe, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiAllResponses } from './decorators/swaggers-decorators';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/usuario.dto';
import { UpdateUserDto } from './dto/usuario.dto';

@Controller('users')
export class UserController {
  constructor(private readonly appService: AppService) { }

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'O usuário foi criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.appService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Encontra um usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário existente' })
  @ApiResponse({ status: 200, description: 'O usuário foi atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.appService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário' })
  @ApiResponse({ status: 200, description: 'O usuário foi deletado com sucesso e seus dados são retornados.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appService.remove(id);
  }
}
