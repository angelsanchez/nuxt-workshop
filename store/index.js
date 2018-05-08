import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    strict: true,
    state: {
      searchText: '',
      searchResults: null,
      show: null
    },
    mutations: {
      updateSearchText (state, payload) {
        state.searchText = payload
      },
      updateSearchResults (state, payload) {
        state.searchResults = payload
      },
      updateShow (state, payload) {
        state.show = payload
      }
    },
    actions: {
      async searchShows ({ commit, state }) {
        const {data: shows} = await axios.get(`http://api.tvmaze.com/search/shows?q=${encodeURIComponent(state.searchText)}`)
        commit('updateSearchResults', shows)
      },
      async getShow ({ commit }, showId) {
        const {data: show} = await axios.get(`http://api.tvmaze.com/shows/${showId}`)
        commit('updateShow', show)
      }
    }
  })
}

export default createStore
