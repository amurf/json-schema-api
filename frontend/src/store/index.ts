import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

interface State {
  uuid: string,
};

const initialState: State = {
  uuid: '',
};

export default new Vuex.Store({
  state: initialState,
  mutations: {
    setUUID(state, uuid: string) {
      state.uuid = uuid;
    },
  },
  actions: {
    async start(context) {
      let response = await axios.post('/api/create');
      context.commit('setUUID', response.data.id);
    },
  },
})
