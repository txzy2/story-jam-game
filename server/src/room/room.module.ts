import {Module} from '@nestjs/common';
import {PrismaService} from 'src/prisma.service';
import {RoomController} from './room.controller';
import {RoomService} from './room.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService],
  exports: [RoomService]
})
export class RoomModule {}
