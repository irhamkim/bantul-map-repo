import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
	state: {
		user: null,
		keyword: null,
		activeWindow: null,
		activeForm: null,
		locationDetailIsActive: false,
		searchResultIsActive: false,
		reviewListIsActive: false,
	},
	mutations: {
		setUserState(state, user) {
			state.user = user;
		},
		removeUserState(state) {
			state.user = null;
		},
		searchLocation(state, keyword) {
			state.keyword = keyword
		},
		openSearchResult(state) {
			state.searchResultIsActive = true
		},
		closeSearchResult(state) {
			state.searchResultIsActive = false
		},
		openLocationDetail(state) {
			state.locationDetailIsActive = true
		},
		closeLocationDetail(state) {
			state.locationDetailIsActive = false
		},
		openWindow(state, payload) {
			state.activeWindow = payload
		},
		closeWindow(state) {
			state.activeWindow = null
		},
		openForm(state, payload) {
			state.activeForm = payload
		},
		closeForm(state) {
			state.activeForm = null
		},
		openReviewList(state) {
			state.reviewListIsActive = true
		},
		closeReviewList(state) {
			state.reviewListIsActive = false
		}
	},
	actions: {
		
	}
});

export default store