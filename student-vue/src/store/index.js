import { createStore } from 'vuex'

import app from './app'
import auth from './auth'
import user from './user'
import course from './course'
import message from './message'
const store = createStore({
  strict: true,
  modules: {
    app,
    auth,
    user,
    course,
    message
  },
})
export default store
