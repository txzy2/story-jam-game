import {defineStore} from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      user: {
        id: '',
        created_at: '',
        updated_at: '',
        username: '',
        avatar: ''
      },
      room: {
        id: '',
        roomName: '',
        owner: '',
        code: '',
        userCount: 0,
        roundTime: 0,
        players: []
      }
    };
  },
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    setRoom(room: any) {
      this.room = room;
    }
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    getRoom: state => {
      console.log;
      return state.room;
    }
  }
});
