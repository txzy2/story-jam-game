export class UserRequestDTO {
  username: string;
  avatar: string;
}

export class UserDTO {
  id: string;

  createdAt?: Date;
  updatedAt?: Date;

  username: string;
  avatar: string;

  rooms?: RoomDTO[];
  texts?: TextDTO[];

  constructor({
    id,
    createdAt,
    updatedAt,
    username,
    avatar,
    rooms = [],
    texts = []
  }: Partial<UserDTO>) {
    this.id = id!;
    this.createdAt = createdAt!;
    this.updatedAt = updatedAt!;
    this.username = username!;
    this.avatar = avatar!;
    this.rooms = rooms.map(room => new RoomDTO(room));
    this.texts = texts.map(text => new TextDTO(text));
  }
}

export class RoomDTO {
  id: string;

  title: string;
  theme: string;
  maxPlayers: number;
  roundTime: number;
  isFinished: boolean;

  owner: UserDTO;
  players: UserDTO[];
  texts: TextDTO[];

  constructor({
    id,
    title,
    theme,
    maxPlayers,
    roundTime,
    isFinished = false,
    owner = null,
    players = [],
    texts = []
  }: Partial<RoomDTO>) {
    this.id = id!;
    this.title = title!;
    this.theme = theme!;
    this.maxPlayers = maxPlayers!;
    this.roundTime = roundTime!;
    this.isFinished = isFinished;
    this.owner = owner ? new UserDTO(owner) : null;
    this.players = players.map(player => new UserDTO(player));
    this.texts = texts.map(text => new TextDTO(text));
  }
}

export class TextDTO {
  id: string;
  playerId: number;
  roomId: number;
  text: string;
  player: UserDTO | null;
  room: RoomDTO | null;

  constructor({
    id,
    playerId,
    roomId,
    text,
    player = null,
    room = null
  }: Partial<TextDTO>) {
    this.id = id!;
    this.playerId = playerId!;
    this.roomId = roomId!;
    this.text = text!;
    this.player = player ? new UserDTO(player) : null;
    this.room = room ? new RoomDTO(room) : null;
  }
}
