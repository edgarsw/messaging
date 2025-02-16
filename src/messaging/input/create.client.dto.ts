import { IsNotEmpty, IsString, Length } from "class-validator";


export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @Length(14, 14, { message: 'The whatsapp phone length is wrong' })
  whatsapp_telefono: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'The whatsapp phone length is wrong' })
  mostrar_telefono: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 250, { message: 'The client name length is wrong' })
  nombre_cliente: string;
}
