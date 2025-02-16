import { EmployeeEntity } from "../entities/employee.entity";
import { ConversationEntity } from "../entities/conversation.entity";
import { TypeSender } from "../constants/constants";

export class ListMessages {
    idmessage: number;
    message: string;

    // @Transform(({ value }) => value === 'true')
    // @IsBoolean()
    // @IsOptional()
    leido?: number;
    respondido?: number;

    page: number = 1;
    limit: number = 20
    fecha?: string;
    hora?: string;
    created_at?: string;
    enviadoPor: TypeSender;
    conversation: ConversationEntity;
    employee: EmployeeEntity | null
}