import { messagesAll, messagesUsers } from "@/api/message";

const state = {
    messages: [],
    userMessagesInfo: [],
}
const getters = {
    messages: () => {
        return state.messages
    },
    userMessagesInfo: () => {
        return state.userMessagesInfo
    }
}
const mutations = {
    setMessages(state, messages) {
        state.messages = messages;
    },
    setMessagesInfo(state, userMessagesInfo) {
        state.userMessagesInfo = userMessagesInfo;
    }

}
const actions = {
    fetchMessages({ commit }) {
        messagesAll().then((res) => {
            commit('setMessages', res.data);
        });
    },
    fetchUserMessagesInfo({ commit }, payload) {
        messagesUsers(payload.id).then((res) => {
            commit('setMessagesInfo', res.data);
        });
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
