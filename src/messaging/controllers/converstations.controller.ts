import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ConversationsService } from '../services/conversations.service';
import { CreateConversationDto } from '../input/create.conversation.dto';
import { ConversationEntity } from '../entities/conversation.entity';
import { ApiResponse } from 'src/response/api.response';
import { ChatGateway } from '../gateway/chat.gateway';

@Controller('conversations')
export class ConverstionsController {
    constructor(
        private readonly conversationsService: ConversationsService,
        private readonly chatGateway: ChatGateway
    ) { }

    @Post('create')
    async createConversation(@Body() createConversationDto: CreateConversationDto): Promise<ApiResponse<ConversationEntity>> {
        const conversation = await this.conversationsService.createConversation(createConversationDto);
        this.chatGateway.sendNewClientWithConversation(conversation.data.client.idclient);
        return conversation;
    }

    @Get('client/:clientId')
    async getConversationByClient(@Param('clientId') clientId: number): Promise<ApiResponse<ConversationEntity>>{
        return await this.conversationsService.getConversationByClient(clientId);
    }

    @Get('all')
    getConversations() {
        return this.conversationsService.getConversations();
    }

    @Get('count/:id')
    async countActiveConversationByClient(@Param('id', ParseIntPipe) conversationId) {
        return await this.conversationsService.countActiveConversationByClient(conversationId);
    }
}
