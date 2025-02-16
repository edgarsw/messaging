import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { ListClients } from '../input/list.client';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { ApiResponse } from 'src/response/api.response';
import { CreateClientDto } from '../input/create.client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) { }

  private getClientBaseQuery() {
    return this.clientRepository
      .createQueryBuilder('client')
      .innerJoinAndSelect('client.conversations', 'conversation')
      .orderBy('conversation.created_at', 'DESC');
  }

  private getFilteredClients(filter?: ListClients) {
    let query = this.getClientBaseQuery();

    if (!filter) {
      return query;
    }

    if (filter?.conversation?.isactiva) {
      query.andWhere('conversation.isactiva = :isActive', { isActive: filter.conversation.isactiva });
    }

    if (filter?.conversation?.estatus) {
      query.andWhere('conversation.estatus = :status', { status: filter.conversation.estatus });
    }

    return query;
  }

  public async getFilteredPaginatedClients(
    filter: ListClients,
    paginateOptions: PaginateOptions
  ) {
    return await paginate(
      await this.getFilteredClients(filter),
      paginateOptions
    );
  }

  public async getClient(id: number): Promise<ApiResponse<ClientEntity>> {
    try {
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .innerJoinAndSelect('client.conversations', 'conversation', 'conversation.isactiva = :isActive', { isActive: 1 })
        .where('client.idclient = :id', { id })
        .getOne();

      if (!client) {
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      }

      return new ApiResponse<ClientEntity>({
        status: 'success',
        data: client,
        message: 'Client get successfully'
      });
    } catch (error) {
      return new ApiResponse<null>({
        status: 'error',
        data: null,
        message: 'Failed to get client',
        error: {
          code: error.status || 500,
          message: error.message,
        },
      });
    }
  }

  async createClient(createClientDto: CreateClientDto): Promise<ApiResponse<ClientEntity>> {
    try {
      const { whatsapp_telefono, mostrar_telefono, nombre_cliente } = createClientDto;

      let originalString: string = whatsapp_telefono.trim();
      let phoneNumber: string = originalString.slice(4);

      if(phoneNumber !== mostrar_telefono.trim()){
        throw new HttpException('Client phones arent same', HttpStatus.BAD_REQUEST);
      }


      const client = await this.clientRepository.findOne({ where: { mostrar_telefono } });
      if (client) {
        throw new HttpException('Client phone already exists', HttpStatus.CONFLICT);
      }

      const conversation = this.clientRepository.create({
        whatsapp_telefono: whatsapp_telefono.trim(),
        mostrar_telefono: mostrar_telefono.trim(),
        nombre_cliente: nombre_cliente.trim(),
      });
      const savedClient = await this.clientRepository.save(conversation);

      return new ApiResponse<ClientEntity>({
        status: 'success',
        data: savedClient,
        message: 'Client created successfully'
      });

    } catch (error) {
      return new ApiResponse<null>({
        status: 'error',
        data: null,
        message: 'Failed to create client',
        error: {
          code: error.status || 500,
          message: error.message,
        },
      });
    }
  }
}
