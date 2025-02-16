import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from './api.response';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    // Obtener los mensajes de error de validación
    const exceptionResponse: any = exception.getResponse();
    const message = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [exceptionResponse.message];

    // Crear la respuesta en el formato de ApiResponse
    const errorResponse = new ApiResponse<any>({
      status: 'fail',
      data: null,
      message: 'Bad format error',
      error: {
        code: status,
        message: message.join(', '),
      },
    });

    response.status(status).json(errorResponse);
  }
}
