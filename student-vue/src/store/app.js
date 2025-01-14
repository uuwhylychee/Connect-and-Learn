const state = {
  lang: localStorage.getItem('language') || 'zh_CN',
}
const getters = {
  getAMapKey: (state) => state.aMapKey,
}
const mutations = {
  SET_AMAP_KEY(state, aMapKey) {
    state.aMapKey = aMapKey
    localStorage.setItem('amap-key', aMapKey)
  },
  SET_BMAP_KEY(state, bMapKey) {
    state.bMapKey = bMapKey
    localStorage.setItem('bmap-key', bMapKey)
  },
  CLEAR_LANG(state) {
    state.lang = ''
    localStorage.getItem('language') && localStorage.removeItem('language')
  },
  CLEAR_AMAP_KEY(state) {
    state.lang = ''
    localStorage.getItem('amap-key') && localStorage.removeItem('amap-key')
  },
  CLEAR_BMAP_KEY(state) {
    state.lang = ''
    localStorage.getItem('amap-key') && localStorage.removeItem('amap-key')
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
