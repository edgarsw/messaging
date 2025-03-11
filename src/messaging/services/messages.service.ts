import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';
import { MessageEntity } from '../entities/message.entity';
import { EmployeeEntity } from '../entities/employee.entity';
import { ListMessages } from '../input/list.message';
import { paginateInverse, PaginateOptions } from 'src/pagination/paginator';
import { ApiResponse } from 'src/response/api.response';
import { CreateMessageDto } from '../input/create.message.dto';
import { TypeSender } from '../constants/constants';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
  ) { }

  private getMessageBaseQuery() {
    return this.messageRepository
      .createQueryBuilder('m')
      .innerJoinAndSelect('m.conversation', 'c')
      .leftJoinAndSelect('m.employee', 'e')
      .orderBy('m.idmessage', 'ASC');
  }

  private getFilteredMessages(filter?: ListMessages) {
    let query = this.getMessageBaseQuery();

    if (!filter) {
      return query;
    }

    //console.log(filter);

    if (filter?.conversation?.idconversation) {
      //query.andWhere('c.conversation LIKE :nombre', { nombre: `%${filter.name}%` });
      query.andWhere('c.idconversation = :idconversation', { idconversation: filter.conversation.idconversation });
    }

    if (filter.leido) {
      query.andWhere('m.isleido = :isleido', { isleido: filter.leido });
    }

    if (filter.respondido) {
      query.andWhere('m.isrespondido = :isrespondido', { respondido: filter.respondido });
    }

    return query;
  }

  public async getFilteredPaginatedMessages(
    filter: ListMessages,
    paginateOptions: PaginateOptions
  ) {
    return await paginateInverse(
      await this.getFilteredMessages(filter),
      paginateOptions
    );
  }

  async countRecords(conversationId: number) {
    try {
      const records = await this.messageRepository
        .createQueryBuilder('m')
        .innerJoinAndSelect('m.conversation', 'c')
        .where('c.idconversation = :idconversation', { idconversation: conversationId })
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
        message: 'Failed to get guardia',
        error: {
          code: error.status || 500,
          message: error.message,
        },
      });
    }
  }

  async saveMessage(
    createMessageDto: CreateMessageDto,
  ): Promise<ApiResponse<MessageEntity>> {
    const { conversationId, message, sender, employeeId } = createMessageDto;
    const conversation = await this.conversationRepository.findOne({ where: { idconversation: conversationId } });
    if (!conversation) {
      throw new HttpException('There arent conversation', HttpStatus.NOT_FOUND);
    }

    const employee = employeeId ? await this.employeeRepo.findOne({ where: { idemployee: employeeId } }) : null;
    if (sender === 'empleado' && !employeeId) {
      throw new HttpException('There arent employee', HttpStatus.NOT_FOUND);
    }

    const MessageEntity = this.messageRepository.create({
      mensaje: message,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString('es-MX', { hour12: false }), // Formato 24h
      enviadoPor: sender,
      conversation,
      employee
    });

    const savedMessageEntity = await this.messageRepository.save(MessageEntity);

    let finalMessage = null;

    if (sender === 'empleado') {
      finalMessage = await this.messageRepository
        .createQueryBuilder('m')
        .innerJoinAndSelect('m.conversation', 'co')
        .innerJoinAndSelect('co.client', 'cl')
        .innerJoinAndSelect('m.employee', 'e')
        .where('m.idmessage = :messageId', { messageId: savedMessageEntity.idmessage })
        .andWhere('co.isactiva = :isactiva', { isactiva: 1 })
        .getOne();
    } else {
      finalMessage = await this.messageRepository
        .createQueryBuilder('m')
        .innerJoinAndSelect('m.conversation', 'co')
        .innerJoinAndSelect('co.client', 'cl')
        .where('m.idmessage = :messageId', { messageId: savedMessageEntity.idmessage })
        .andWhere('co.isactiva = :isactiva', { isactiva: 1 })
        .getOne();
    }



    return new ApiResponse<MessageEntity>({
      status: 'success',
      data: finalMessage,
      message: 'Message created successfully'
    });
  }
}
