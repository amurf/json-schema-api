import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

import schema from '/app/config/schema.yaml';
import forms  from '/app/config/forms.yaml';

const initialState = {
  uuid: '',
  schema: schema,
  forms: forms,
};

export default new Vuex.Store({
  state: initialState,
  mutations: {
    pushForm(state, payload) {
      state.forms[payload.form].push({ label: payload.label, name: payload.name });
    },
    setUUID(state, uuid: string) {
      state.uuid = uuid;
    },
  },
  actions: {
    async start(context) {
      let response = await axios.post('/api/create');
      context.commit('setUUID', response.data.id);
    },
    addField(context, payload) {
      context.commit('pushForm', payload);
    },
  },
})
