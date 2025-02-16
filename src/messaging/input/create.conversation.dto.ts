import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { StatusConversation } from "../enum/status.conversation.enum";

export class CreateConversationDto {
  @IsNumber()
  clienteId: number;

  // @IsNumber()
  // @IsOptional()
  // employeeId: number;

  @IsString()
  @IsNotEmpty()
  tema: string;

  // @IsString()
  // @IsNotEmpty()
  // mensaje: string;

  // @IsNotEmpty()
  // @IsOptional()
  // enviadoPor: TypeSender = 'cliente';

  @IsEnum(StatusConversation)
  @IsOptional()
  estatus: StatusConversation = StatusConversation.ABIERTA;
}
