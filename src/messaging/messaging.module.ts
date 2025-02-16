import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { MessageEntity } from './entities/message.entity';
import { ConversationEntity } from './entities/conversation.entity';
import { EmployeeEntity } from './entities/employee.entity';
import { ConverstionsController } from './controllers/converstations.controller';
import { ConversationsService } from './services/conversations.service';
import { MessagesController } from './controllers/messages.controller';
import { MessagesService } from './services/messages.service';
import { ClientService } from './services/client.service';
import { ClientsController } from './controllers/clients.controller';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity, MessageEntity, ConversationEntity, EmployeeEntity]),
  ],
  providers: [ConversationsService, MessagesService, ClientService, ChatGateway],
  controllers: [ ConverstionsController, 
    MessagesController, ClientsController]
})
export class MessagingModule { }
