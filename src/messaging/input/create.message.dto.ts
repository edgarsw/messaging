import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TypeSender } from "../constants/constants";

export class CreateMessageDto {
  @IsNumber()
  conversationId: number;

  @IsNumber()
  @IsOptional()
  employeeId: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsOptional()
  sender: TypeSender = 'cliente';
}
