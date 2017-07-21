<template>
	<div class="floating-menu">
		<div class="floating-menu__search-input-wrapper">
			<input class="floating-menu__search-input" type="text" placeholder="Search location"
				v-model="searchKeyword"
				@keyup.enter="searchLocation"
				@keyup.esc="closeSearchResult">
		</div>
		<button class="floating-menu__flat-button"
			@click="searchLocation">Search</button>		
		<button v-if="isLoggedIn && !windowOpen && !searchKeyword" class="floating-menu__button"
			@click="openUserMenu">{{ userDisplayName }}</button>
		<button v-if="windowOpen && !searchKeyword" class="floating-menu__button"
			@click="closeWindow">Close</button>
		<button v-if="!isLoggedIn" class="floating-menu__button"
			@click="openLoginForm">Login</button>
		<button v-if="searchKeyword" class="floating-menu__button"
			@click="closeSearchResult">Cancel
		</button>
	</div>
</template>

<script>
import firebase from '../firebaseApp'

export default {
	name: 'floatingMenu',
	data() {
		return {
			searchKeyword: null,
		}
	},
	computed: {
		isLoggedIn() {
			return this.$store.state.user ? true : false
		},
		userDisplayName() {
			let str = this.$store.state.user.providerData[0].displayName

			let strSub = str.substr(0, str.indexOf(' ') ? str.indexOf(' ') : str.length())

			return strSub.length < 6 ? strSub : strSub.substr(0, 6) + '..'
		},
		windowOpen() {
			return this.$store.state.openWindow ? true : false
		},
		infoWindowOpen() {
			return this.$store.state.infoWindowOpen ? true : false
		}
	},
	methods: {
		searchLocation() {
			if (this.searchKeyword) {
				this.$store.commit('searchLocation', this.searchKeyword)
				this.$store.commit('openWindow', 'searchResult')
			} else {
				this.$store.state.openWindow === 'infoWindow' ? '' : this.$store.commit('closeWindow')
			}
		},
		openLoginForm() {
			this.$store.commit('openForm', 'loginForm')
		},
		logOutUser() {
			firebase.auth().signOut().then(() => {
				this.$store.commit('removeUserState')
			}).catch((error) => {

			})
		},
		openUserMenu() {
			this.$store.commit('openWindow', 'userMenu')
		},
		closeUserMenu() {
			this.$store.commit('closeWindow')
		},
		closeSearchResult() {
			this.searchKeyword = null
			this.$store.commit('closeWindow')
		},
		closeWindow() {
			this.$store.commit('closeWindow')
		},
	}

}

</script>
	
<style lang="scss">
	.floating-menu {
		background-color: white;
		border-radius: 5px;
		box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		box-sizing: border-box;
		display: flex;
		padding: 5px;
		position: absolute;
		top: 5px;
		left: 5px;
		width: 420px;
		height: 40px;
		z-index: 3;
		@media (max-width : 429px) {
			width: calc(100% - 10px);
		}
		&__search-input-wrapper {
			display: flex;
			flex: 1 1 auto;
			position: relative;
			max-width: 70%;
			height: 30px;
			&::after {
				border-right: 2px solid rgba(0, 0, 0, 0.25);
				content: '';
				position: absolute;
				right: 0;
				height: 30px;
			}
			@media (max-width : 429px) {
				
			}
		}
		&__search-input {
			box-sizing: border-box;
			border: none;
			color: rgba(0, 0, 0, 0.5);
			font-family: Roboto, Helvetica;
			font-size: 17px;
			width: 100%;
			padding-left: 5px;
			height: 30px;
			&:active, &:focus {
				outline-style: none;
			}
			@media (max-width : 429px) {
				
			}
		}
		&__button {
			box-sizing: border-box;
			background-color: #00b27c;
			border: none;
			color: white;
			flex: 1 1 15%;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			height: 30px;
			&:focus {
				outline-style: none;
			}
		}
		&__flat-button {
			box-sizing: border-box;
			background-color: white;
			border: none;
			color: rgba(0, 0, 0, 0.5);
			flex: 1 1 15%;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			height: 30px;
			&:focus {
				outline-style: none;
			}
		}
	}
</style>