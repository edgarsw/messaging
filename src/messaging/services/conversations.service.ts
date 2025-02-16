import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';
import { ClientEntity } from '../entities/client.entity';
import { ApiResponse } from 'src/response/api.response';
import { CreateConversationDto } from '../input/create.conversation.dto';
import { MessageEntity } from '../entities/message.entity';
@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) { }

  async createConversation(createConversationDto: CreateConversationDto): Promise<ApiResponse<ConversationEntity>> {
    try {
      const { clienteId, tema } = createConversationDto;

      const client = await this.clientRepository.findOne({ where: { idclient: clienteId } });
      if (!client) {
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      }

      let message = tema;

      if(tema.length > 250){
        message = tema.substring(0, 250);
      }

      const conversation = this.conversationRepository.create({
        tema: message,
        client: client,
        isactiva: 1,
      });
      const savedConversation = await this.conversationRepository.save(conversation);

      return new ApiResponse<ConversationEntity>({
        status: 'success',
        data: savedConversation,
        message: 'Conversation created successfully'
      });

    } catch (error) {
      return new ApiResponse<null>({
        status: 'error',
        data: null,
        message: 'Failed to create conversation',
        error: {
            code: error.status || 500,
            message: error.message,
        },
    });
    }
  }

  async getConversationByClient(clientId: number): Promise<ApiResponse<ConversationEntity>> {
    try {
      const conversation = await this.conversationRepository
        .createQueryBuilder('co')
        .innerJoinAndSelect('co.client', 'cl')
        .where('cl.idclient = :clientId', { clientId: clientId })
        .andWhere('co.isactiva = :isactiva', { isactiva: 1 })
        .getOne();

      if (!conversation) {
        throw new HttpException('There isnt conversation', HttpStatus.NOT_FOUND);
      }

      return new ApiResponse<ConversationEntity>({
        status: 'success',
        data: conversation,
        message: 'Total of records successfully'
      });
    } catch (error) {
      return new ApiResponse<ConversationEntity>({
        status: 'error',
        data: null,
        message: 'Failed to get conversations',
        error: {
          code: error.status || 500,
          message: error.message,
        },
      });
    }
  }

  async getActiveConversationByClient(clienteId: number) {
    return this.conversationRepository.find({
      where: { client: { idclient: clienteId } },
      relations: ['client', 'messages'],
    });
  }

  async getConversations() {
    return this.conversationRepository.find({ relations: ['client', 'messages'] });
  }

  async countActiveConversationByClient(clientId: number) {
    try {
      const records = await this.conversationRepository
        .createQueryBuilder('co')
        .innerJoinAndSelect('co.client', 'cl')
        .where('cl.idclient = :clientId', { clientId: clientId })
        .andWhere('co.isactiva = :isactiva', { isactiva: 1 })
        .getCount();

      if (!records) {
        throw new HttpException('There arent messages', HttpStatus.NOT_FOUND);
      }

      return new ApiResponse<any>({
        status: 'success',
        data: {
          records: records,
        },
        message: 'Total of records successfully'
      });
    } catch (error) {
      return new ApiResponse<null>({
        status: 'error',
        data: null,
        message: 'Failed to count conversations',
        error: {
          code: error.status || 500,
          message: error.message,
        },
      });
    }
  }

  // async getConversations() {
  //   return this.conversationRepository.find({ relations: ['client', 'messages'] });
  // }
}
