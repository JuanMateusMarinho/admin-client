import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, IsNumber, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({description: 'O nome do usuário', example: 'Maria Souza'})
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    @ApiProperty({description: 'O email do usuário', example: 'maria.souza@email.com'})
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
  
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name?: string;
    @IsEmail()
    @IsNotEmpty()
    readonly email?: string;
}

export class DeleteUserDto {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
}