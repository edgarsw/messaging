import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../input/create.message.dto';
import { ClientService } from '../services/client.service';
import { MessageEntity } from '../entities/message.entity';
import { ApiResponse } from 'src/response/api.response';

@WebSocketGateway({ cors: true }) // Permite conexiones desde otros dominios
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly clientService: ClientService
  ) { }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = createMessageDto;
    // Guarda el mensaje en la base de datos
    const savedMessage = await this.messagesService.saveMessage(createMessageDto);

    // Notifica a todos los clientes en la conversación
    this.server.to(`conversation_${conversationId}`).emit('newMessageEmployee', savedMessage);
    //console.log(`Salas activas:`, this.server.sockets.adapter.rooms);
    //this.server.emit('newMessage', savedMessage);
    //emite solo al cliente que envio el mensaje
    //client.emit('messageReceived', { success: true });
    // console.log(client.id); // Muestra el ID del socket del cliente
    // console.log(client.handshake.auth); // Accede a datos de autenticación si los envía

    return savedMessage;
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(@MessageBody() conversationId: number, @ConnectedSocket() client: Socket) {
    client.join(`conversation_${conversationId}`);
    // console.log(`Salas activas:`, this.server.sockets.adapter.rooms);
    // console.log(`Cliente ${client.id} se unió a la conversación ${conversationId}`);
  }

  async sendNewClientWithConversation(clientId: number) {
    const client = await this.clientService.getClient(clientId);
    this.server.emit('newConversation', { client });
  }

  notifyNewMessage(message: ApiResponse<MessageEntity>) {
    this.server.emit('newMessageClient', { message });
  }
}
