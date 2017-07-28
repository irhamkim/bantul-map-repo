import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
	state: {
		user: null,
		keyword: null,
		infoWindowOpen: false,
		userMenuOpen: false,
		openWindow: null,
		openForm: null,
		height: null,
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
		},
		openInfoWindow(state) {
			state.infoWindowOpen = true
		},
		closeInfoWindow(state) {
			state.infoWindowOpen = false
		},
		openUserMenu(state) {
			state.userMenuOpen = true
		},
		closeUserMenu(state) {
			state.userMenuOpen = false
		},
		openWindow(state, payload) {
			state.openWindow = payload
		},
		closeWindow(state) {
			state.openWindow = null
		},
		openForm(state, payload) {
			state.openForm = payload
		},
		closeForm(state) {
			state.openForm = null
		},
		setHeight(state, payload) {
			state.height = payload
		},
	},
	actions: {
		
	}
});

export default store