import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
	state: {
		user: null,
	},
	getters: {
		userDisplayName: function(state) {
			if (state.user) {
				var providerData = state.user.providerData[0];
			
				if (providerData.providerId !== 'password') {
					return providerData.displayName;
				} else {
					return state.user.displayName;
				}
			} else {
				return null;
			}
		}
	},
	mutations: {
		setUserState: function(state, user) {
			state.user = user;
		},
		removeUserState: function(state) {
			state.user = null;
		}
	},
	actions: {
		
	}
});

export default store