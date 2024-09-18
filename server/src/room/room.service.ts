import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma.service';
import {RoomRequestDTO} from 'src/shared/dto/room.dto';
import {RoomDTO} from 'src/shared/dto/user.dto';

const passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

const generateRandomCode = () => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*';
  let code;
  do {
    code = Array(8)
      .fill('')
      .map(() => charset[Math.floor(Math.random() * charset.length)])
      .join('');
  } while (!passwordStrength.test(code));
  return code;
};

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(dto: RoomRequestDTO) {
    const ownerExists = await this.prisma.user.findUnique({
      where: {id: dto.owner.id}
    });

    console.log('Owner exists:', ownerExists);

    if (!ownerExists) {
      throw new BadRequestException('Owner does not exist');
    }

    const existRoom = await this.prisma.room.findUnique({
      where: {
        id: dto.id
      }
    });

    if (existRoom) throw new BadRequestException('Room already exists');

    const room = await this.prisma.room.create({
      data: {
        id: dto.id,
        title: dto.title,
        theme: 'title',
        maxPlayers: dto.maxPlayers,
        roundTime: dto.roundTime,
        isFinished: false,
        ownerId: dto.owner.id,
        code: generateRandomCode(),
        players: {
          create: [
            {
              userId: dto.owner.id,
              username: dto.owner.username,
              avatar: dto.owner.avatar
            }
          ]
        }
      },
      include: {
        players: true
      }
    });

    console.log(room);

    return room;
  }

  async joinRoom(dto: {
    code: string;
    player: {id: string; username: string; avatar: string};
  }) {
    const existRoom = await this.prisma.room.findUnique({
      where: {
        code: dto.code
      }
    });

    if (!existRoom) throw new BadRequestException('Room does not exist');

    const add = await this.prisma.room.update({
      where: {
        id: existRoom.id
      },
      data: {
        players: {
          create: {
            userId: dto.player.id,
            username: dto.player.username,
            avatar: dto.player.avatar
          }
        }
      },
      include: {
        players: true
      }
    });

    return add;
  }
}
