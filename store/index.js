import { getChtas } from "/api/modules/chats";

export const state = () => ({
  chatsList: [],
  conversantions: [],
  isOfline: false,
});

export const mutations = {
  SET_USERS_CHATS_list(state, payload) {
    state.chatsList = payload;
  },
  SET_USERS_CHATS(state, payload) {
    state.conversantions = payload;
  },
  SET_OFLINE(state, payload) {
    state.isOfline = payload;
  },
};

export const actions = {
  async getChtasList({ commit }, payload) {
    let res = await getChtas(payload);
    commit("SET_USERS_CHATS_list", res.data);
  },
  async getConversation({ commit }, payload) {
    let res = await getChtas(payload);
    commit("SET_USERS_CHATS", res.data);
  },
};
