import { projectDB } from '@/db'

const state = []

const mutations = {
  create (state, payload) {
    state.push(payload)
  },

  remove (state, payload) {
    const index = state.findIndex(x => x.id === payload.id)
    state.splice(index, 1)
  },

  init (state, payload) {
    payload = payload.sort((a, b) => a.id - b.id)
    state.splice(0, state.length)
    state.push(...payload)
  }
}

const filterList = (state, type) => {
  return state.filter(x => x.type === type)
}

const getters = {
  getListByType: state => type => {
    return filterList(state, type)
  }
}

const actions = {
  create ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const project = { id: Date.now(), ...payload }
      projectDB.insert(project, function (err) {
        if (err) {
          return reject(err)
        }

        commit('create', payload)
        resolve()
      })
    })
  },
  remove ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      projectDB.remove(payload, function (err) {
        if (err) {
          return reject(err)
        }

        commit('remove', payload)
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
