import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UsuarioDto {
  @ApiProperty({ description: 'Primeiro usuário', example: 'joao' })
  @IsString()
  @IsNotEmpty()
  primeiroUsuario: string;

  @ApiProperty({ description: 'Segundo usuário', example: 'maria' })
  @IsString()
  @IsNotEmpty()
  segundoUsuario: string;
}