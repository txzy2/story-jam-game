import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {RoomService} from './room.service';
import {RoomRequestDTO} from 'src/shared/dto/room.dto';

@Controller('room')
@UsePipes(new ValidationPipe())
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @HttpCode(200)
  @Post('create')
  async createRoom(@Body() dto: RoomRequestDTO) {
    console.log(dto);
    return this.roomService.create(dto);
  }

  @HttpCode(200)
  @Post('join')
  async joinRoom(
    @Body()
    dto: {
      code: string;
      player: {
        id: string;
        username: string;
        avatar: string;
      };
    }
  ) {
    console.log(dto);
    return this.roomService.joinRoom(dto);
  }
}
