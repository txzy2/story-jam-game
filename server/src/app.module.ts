import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {GatewayModule} from './gateway/gateway.module';
import {PrismaService} from './prisma.service';
import {UserModule} from './user/user.module';
import {RoomModule} from './room/room.module';

@Module({
  imports: [GatewayModule, UserModule, RoomModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
