import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
	state: {
		user: null,
		keyword: null
	},
	getters: {
		userDisplayName: function(state) {
			
		}
	},
	mutations: {
		setUserState: function(state, user) {
			state.user = user;
		},
		removeUserState: function(state) {
			state.user = null;
		},
		searchLocation(state, keyword) {
			state.keyword = keyword
		}
	},
	actions: {
		
	}
});

export default store