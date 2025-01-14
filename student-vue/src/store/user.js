import { getfetchUsers,updateUser, addUser, deleteUser } from "@/api/user";

const state = {
    users: [],
}
const getters = {
    users: () => {
        return state.users
    },
}
const mutations = {
    setUsers(state, users) {
        state.users = users;
    }
}
const actions = {
    fetchUsers({ commit }) {
        getfetchUsers().then((users) => {
            commit('setUsers', users.data);
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
