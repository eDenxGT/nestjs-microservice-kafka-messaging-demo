import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageDto } from 'src/dto/message.dto';

@Controller()
export class MessagesController {
  constructor(private _messagesService: MessagesService) {}

  @Post('send-message')
  async handleSendMessage(@Body() body: MessageDto) {
    return this._messagesService.sendMessage(body);
  }
}
