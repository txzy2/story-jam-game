import {TextDTO, UserDTO} from './user.dto';

export class RoomRequestDTO {
  id: string;

  title: string;
  maxPlayers: number;
  roundTime: number;

  owner: UserDTO;
}

export class RoomDTO {
  id: string;

  title: string;
  theme: string;

  maxPlayers: number;
  roundTime: number;
  status: string;
  owner: UserDTO;
  players?: UserDTO[];
  texts?: TextDTO[];

  constructor({
    id,
    title,
    theme,
    maxPlayers,
    roundTime,
    status = 'Waiting',
    players = [],
    texts = []
  }: Partial<RoomDTO>) {
    this.id = id!;
    this.title = title!;
    this.theme = theme!;
    this.maxPlayers = maxPlayers!;
    this.roundTime = roundTime!;
    this.status = status;
    this.players = players.map(player => new UserDTO(player));
    this.texts = texts.map(text => new TextDTO(text));
  }
}
