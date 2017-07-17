<template>
	<div class="floating-menu">
		<div class="floating-menu__search-form">
			<input class="floating-menu__search-input" type="text" placeholder="Search location"
				v-model="searchKeyword"
				@keyup.enter="searchLocation">
			<button class="floating-menu__search-button"
				@click="searchLocation">Search</button>
		</div>
		<div v-if="!isLoggedIn"
			class="floating-menu__user-section">			
			<button class="floating-menu__flat-button floating-menu__flat-button--first"
				@click="openLoginForm">Login</button>
		</div>
		<div v-else
			class="floating-menu__user-section">
			<div class="floating-menu__display-name">
				<span>{{ userDisplayName }}</span>
			</div>
			<button class="floating-menu__flat-button floating-menu__flat-button--second" 
				@click="logOutUser">Log Out</button>
		</div>
	</div>
</template>

<script>
import firebase from '../firebaseApp'

export default {
	name: 'floatingMenu',
	data() {
		return {
			searchKeyword: null
		}
	},
	computed: {
		isLoggedIn() {
			return this.$store.state.user ? true : false
		},
		userDisplayName() {
			let str = this.$store.state.user.providerData[0].displayName

			let strSub = str.substr(0, str.indexOf(' ') ? str.indexOf(' ') : str.length())

			return strSub.length < 9 ? strSub : strSub.substr(0, 6) + '..'
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
		}
	}

}

</script>
	
<style lang="scss">
	.floating-menu {
		background-color: teal;
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		width: 500px;
		height: 40px;
		z-index: 1;
		&__search-form {
			flex: 1 1 66%;
		}
		&__search-input {
			box-sizing: border-box;
			border: none;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			padding-left: 5px;
			width: 260px;
			height: 30px;
			margin: 5px 0 5px 5px;
			&:active, &:focus {
				outline-style: none;
			}
		}
		&__search-button {
			background-color: white;
			border: none;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			width: 70px;
			height: 30px;
			&:active, &:focus {
				outline-style: none;
			}
		}
		&__user-section {
			display: flex;
			flex: 1 1 30%;
			position: relative;
		}
		&__display-name {
			color: white;
			flex: 1 1 50%;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			position: relative;
			span {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
		&__flat-button {
			background-color: teal;
			border: none;
			color: white;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			&:active, &:focus {
				outline-style: none;
			}
			&--first {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			&--second {
				flex: 1 1 50%;
			}
		}
	}
</style>