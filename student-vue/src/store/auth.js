
const state = {
  token: localStorage.getItem('token') || '',
}
const getters = {
  token: () => {
    // localStorage.setItem('access-token', state.auth)
    return state.token
  },
}
const mutations = {
  GENERATE_ROUTES(state, auth) {
    state.auth = auth
  },
  SET_AUTH(state, auth) {
    state.auth = auth
    localStorage.setItem('access-token', auth)
  },
  CLEAR_AUTH(state) {
    console.log(122121212)
    localStorage.removeItem('access-token')
    state.auth = ''
  },
}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
