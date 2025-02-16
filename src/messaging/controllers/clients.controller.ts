import { Controller, Post, Body, Get, ValidationPipe, UsePipes, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { ListClients } from '../input/list.client';
import { ApiResponse } from 'src/response/api.response';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../input/create.client.dto';
@Controller('clients')
export class ClientsController {
    private readonly logger = new Logger(ClientsController.name);

    constructor(private readonly clientService: ClientService) { }

    @Post('create')
    async createConversation(@Body() createClientDto: CreateClientDto): Promise<ApiResponse<ClientEntity>> {
        const conversation = await this.clientService.createClient(createClientDto);
        return conversation;
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    //@UseInterceptors(ClassSerializerInterceptor)
    async findAllFilter(@Body() filter: ListClients) {
        this.logger.log("Init findAllFilter");
        const messages = await this.clientService
            .getFilteredPaginatedClients(
                filter,
                {
                    total: true,
                    currentPage: filter.page,
                    limit: filter.limit
                }
            );
        this.logger.log("To end findAllFilter");
        return messages;
    }

    @Get(':id')
    //@UseGuards(AuthGuardJwt)
    //@UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id): Promise<ApiResponse<ClientEntity>> {
        return await this.clientService.getClient(id);
    }
}
