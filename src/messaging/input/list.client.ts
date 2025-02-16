import { ConversationEntity } from "../entities/conversation.entity";

export class ListClients {
    idclient: number;
    telefono: string;
    nombre: string;

    page: number = 1;
    limit: number = 20
    conversation: ConversationEntity;
}