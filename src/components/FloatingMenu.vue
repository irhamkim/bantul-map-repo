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
		<button v-if="isLoggedIn && !infoWindowOpen" class="floating-menu__button"
			@click="openUserMenu">{{ userDisplayName }}</button>
		<button v-if="infoWindowOpen" class="floating-menu__button"
			@click="closeInfoWindow">Close</button>
		<button v-if="!isLoggedIn" class="floating-menu__flat-button"
			@click="openLoginForm">Login</button>
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
		infoWindowOpen() {
			return this.$store.state.infoWindowOpen ? true : false
		}
	},
	methods: {
		searchLocation() {
			if (this.searchKeyword) {
				this.$store.commit('searchLocation', this.searchKeyword)
				this.$emit('open-search-result')
			} else {
				this.$emit('close-search-result')
			}
		},
		openLoginForm() {
			this.$emit('open-login-form')
		},
		logOutUser() {
			firebase.auth().signOut().then(() => {
				this.$store.commit('removeUserState')
			}).catch((error) => {

			})
		},
		openUserMenu() {
			this.$emit('open-user-menu')
		},
		closeUserMenu() {
			this.$emit('close-user-menu')
		},
		closeSearchResult() {
			this.searchKeyword = null
			this.$emit('close-search-result')
		},
		closeInfoWindow() {
			this.$emit('close-info-window')
			this.$store.commit('closeInfoWindow')
		},
	}

}

</script>
	
<style lang="scss">
	.floating-menu {
		background-color: white;
		border-radius: 5px;
		box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		position: absolute;
		top: 5px;
		left: 5px;
		width: 420px;
		height: 40px;
		z-index: 3;
		&__search-input-wrapper {
			display: inline-block;
			position: relative;
			width: 260px;
			height: 30px;
			&::after {
				border-right: 2px solid rgba(0, 0, 0, 0.25);
				content: '';
				position: absolute;
				top: 5px;
				right: 0;
				height: 30px;
			}
		}
		&__search-input {
			box-sizing: border-box;
			border: none;
			color: rgba(0, 0, 0, 0.5);
			font-family: Roboto, Helvetica;
			font-size: 17px;
			padding-left: 5px;
			position: relative;
			width: 260px;
			height: 30px;
			margin: 5px 0 5px 5px;
			&:active, &:focus {
				outline-style: none;
			}
		}
		&__button {
			background-color: #00b27c;
			border: none;
			color: white;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			width: 70px;
			height: 30px;
			&:active, &:focus {
				outline-style: none;
			}
		}
		&__flat-button {
			background-color: white;
			border: none;
			color: rgba(0, 0, 0, 0.5);
			font-family: Roboto, Helvetica;
			font-size: 17px;
			width: 70px;
			height: 30px;
			&:active, &:focus {
				outline-style: none;
			}
		}
	}
</style>