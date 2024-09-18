import {BadRequestException, Injectable} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';

import {PrismaService} from 'src/prisma.service';
import {UserDTO, UserRequestDTO} from 'src/shared/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async addUser(dto: UserRequestDTO) {
    const create = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        username: dto.username,
        avatar: dto.avatar
      }
    });

    if (!create) throw new BadRequestException('User not created');

    return this.prisma.user.findUnique({
      where: {
        id: create.id
      },
      include: {
        texts: true,
        players: true
      }
    });
  }
}
