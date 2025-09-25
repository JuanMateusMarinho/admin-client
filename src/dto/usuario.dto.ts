import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({description: 'O nome completo do usuário', example: 'João da Silva'})
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    @ApiProperty({description: 'O endereço de e-mail do usuário', example: 'joao.silva@example.com'})
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
  
}

export class UpdateUserDto {
    @ApiProperty({description: 'O novo nome do usuário', example: 'João da Silva Santos', required: false})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly name?: string;
    @ApiProperty({description: 'O novo e-mail do usuário', example: 'joao.santos@example.com', required: false})
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    readonly email?: string;
}