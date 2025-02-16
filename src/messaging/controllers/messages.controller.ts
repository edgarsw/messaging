import { Controller, Post, Body, Get, Param, ValidationPipe, UsePipes, Query, Logger, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { ListMessages } from '../input/list.message';
import { CreateMessageDto } from '../input/create.message.dto';
import { ChatGateway } from '../gateway/chat.gateway';

@Controller('messages')
export class MessagesController {
    private readonly logger = new Logger(MessagesController.name);

    constructor(
        private readonly messagesService: MessagesService,
        private readonly chatGateway: ChatGateway
    ) { }

    @Post('create')
    async saveMessage(
        @Body() createMessageDto: CreateMessageDto,
    ) {
        const message = await this.messagesService.saveMessage(createMessageDto);
        this.chatGateway.notifyNewMessage(message);
        return message;
    }

    @Post('get')
    @UsePipes(new ValidationPipe({ transform: true }))
    //@UseInterceptors(ClassSerializerInterceptor)
    async findAllFilter(@Body() filter: ListMessages) {
        this.logger.log("Init findAllFilter");
        const messages = await this.messagesService
            .getFilteredPaginatedMessages(
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

    @Get('count/:id')
    async countRecords(@Param('id', ParseIntPipe) conversationId) {
        return await this.messagesService.countRecords(conversationId);
    }
}
