import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ApiAllResponses(options?: {
  summary?: string;
  bodyType?: Type<any> | Function;
  bodyRequired?: boolean;
  bodyDescription?: string;
  okType?: Type<any> | Function;
}) {
  return applyDecorators(
    ApiOperation({ summary: options?.summary ?? '' }),
    ...(options?.bodyType
      ? [
          ApiBody({
            type: options.bodyType,
            required: options.bodyRequired ?? true,
            description: options.bodyDescription ?? '',
          }),
        ]
      : []),
    ApiOkResponse({ description: 'Mensagem retornada com sucesso', type: options?.okType ?? String }),
    ApiBadRequestResponse({ description: 'Requisição inválida (400) — corpo/parâmetros inválidos' }),
    ApiUnauthorizedResponse({ description: 'Não autorizado (401) — credenciais inválidas' }),
    ApiForbiddenResponse({ description: 'Proibido (403) — sem permissão' }),
    ApiNotFoundResponse({ description: 'Não encontrado (404)' }),
    ApiConflictResponse({ description: 'Conflito (409)' }),
    ApiResponse({ status: 422, description: 'Unprocessable Entity (422) — validação falhou' }),
    ApiInternalServerErrorResponse({ description: 'Erro interno do servidor (500)' }),
  );
}