import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMailDTO } from '../dtos';
import { MailsService } from '../services';

@Controller('mails')
@ApiTags('Mail')
export default class MailsController {
  constructor(private readonly mailService: MailsService) {}

  @Post('send')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send Email' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Mail send successfully.',
  })
  @ApiBody({
    type: CreateMailDTO,
    description: 'Data to create new record..',
    required: true,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  async sendMail(@Body() sendMail: any) {
    const receiverEmail = sendMail.receiverEmail;
    const subject = sendMail.subject;
    const template = `./${sendMail.template}`;
    const context = sendMail.context;

    console.log(receiverEmail, subject, template, context);

    await this.mailService.sendEmail(receiverEmail, subject, template, context);
  }
}
