import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {UserService} from './user.service';
import {UserRequestDTO} from 'src/shared/dto/user.dto';

@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('add')
  async addUser(@Body() dto: UserRequestDTO) {
    console.log(dto);
    return this.userService.addUser(dto);
  }
}
