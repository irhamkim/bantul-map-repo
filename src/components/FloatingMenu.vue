<template>
	<div class="floating-menu">
		<input type="text" placeholder="Search location"
			v-model="searchKeyword"
			@keyup="searchLocation">
		<template v-if="!isLoggedIn">			
			<button @click="openLoginForm">Login</button>
		</template>
		<template v-else>
			{{ this.$store.state.user.providerData[0].displayName }}
			<button @click="logOutUser">Log Out</button>
		</template>
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
		}
	},
	methods: {
		searchLocation() {

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
	
<style>
	.floating-menu {
		position: absolute;
		z-index: 1;
	}
</style>