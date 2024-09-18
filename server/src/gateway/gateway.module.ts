import {Module} from '@nestjs/common';
import {MyGateway} from './gateway';
import {PrismaService} from 'src/prisma.service';

@Module({
  providers: [MyGateway, PrismaService]
})
export class GatewayModule {}
