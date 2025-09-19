import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UsuarioDto {
  @ApiProperty({ description: 'usuario', example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'Deve conter apenas letras (acentos permitidos) e espaços, sem números ou caracteres especiais.',
  })
  primeiroUsuario: string;

  @ApiProperty({ description: 'usuario', example: 'Maria' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'Deve conter apenas letras (acentos permitidos) e espaços, sem números ou caracteres especiais.',
  })
  segundoUsuario: string;

  @ApiProperty({ description: 'usuario', example: 'Davi' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'Deve conter apenas letras (acentos permitidos) e espaços, sem números ou caracteres especiais.',
  })
  terceiroUsuario: string;
  
}