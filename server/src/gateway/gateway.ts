import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3300']
  }
})
export class MyGateway implements OnModuleInit {
  constructor(private prisma: PrismaService) { }

  @WebSocketServer()
  server: Server;
  private roomUsers = new Map<string, Set<string>>(); // Хранение пользователей в комнатах

  onModuleInit() {
    this.server.on('connection', socket => {
      console.log(socket.id);
      console.log('Connected');

      socket.on('joinRoom', (code: string) => {
        socket.join(code);
        if (!this.roomUsers.has(code)) {
          this.roomUsers.set(code, new Set());
        }
        this.roomUsers.get(code)?.add(socket.id);
        this.updateRoomUsers(code);
      });

      socket.on('disconnect', () => {
        this.roomUsers.forEach((users, room) => {
          if (users.delete(socket.id)) {
            this.updateRoomUsers(room);
          }
        });
      });

      socket.on('getRoomUsers', (code: string) => {
        const users = Array.from(this.roomUsers.get(code) || []);
        socket.emit('updateUsers', users);
      });

      socket.on('startGame', async (roomId: string) => {
        const room = await this.prisma.room.findUnique({
          where: { code: roomId },
          include: { players: true }
        });

        if (!room) {
          console.error(`Room with id ${roomId} not found`);
          return;
        }

        await this.prisma.room.update({
          where: { code: roomId },
          data: { status: 'Started' }
        });

        this.server.to(roomId).emit('gameStarted', { roomId });
      });

      socket.on('exitRoom', async (code: string, userID: string) => {
        const room = await this.prisma.room.findUnique({
          where: { code: code },
          include: { players: true }
        });

        if (!room) {
          console.error(`Room with id ${code} not found`);
          throw new BadRequestException('Комната не найдена');
        }

        const player = room.players.find(player => player.userId === userID);

        if (!player) {
          throw new BadRequestException('Пользователь не в комнате');
        }

        console.log(code, '\n', userID);

        await this.prisma.player.delete({
          where: { id: player.id }
        });

        const updatedRoom = await this.prisma.room.findUnique({
          where: { code: code },
          include: { players: true }
        });

        socket.to(room.code).emit('playerLeft', { userID, updatedRoom });
      });
    });
  }

  private async updateRoomUsers(roomId: string) {
    const users = Array.from(this.roomUsers.get(roomId) || []);

    const room = await this.prisma.room.findUnique({
      where: { code: roomId },
      include: { players: true }
    });

    if (!room) {
      console.error(`Room with id ${roomId} not found`);
      return;
    }

    this.server.to(roomId).emit('updateRoomInfo', {
      room: room,
      users: users
    });
  }
}
