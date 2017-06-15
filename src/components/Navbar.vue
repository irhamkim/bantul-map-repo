<template>
  <nav class="navbar">
    <router-link class="navbar__item" to="/">
      <span class="navbar__text">Home</span>
    </router-link>
    <div class="navbar__item" v-if="currentUser">
      <span class="navbar__text">{{ displayName }}</span>
    </div>
    <div class="navbar__item" v-if="currentUser" v-on:click="logOutUser">
      <span class="navbar__text">Log Out</span>
    </div>
    <router-link class="navbar__item" v-if="!currentUser" to="/login">
      <span class="navbar__text">Login</span>
    </router-link>
    <router-link class="navbar__item" v-if="!currentUser" to="/register">
      <span class="navbar__text">Register</span>
    </router-link>
  </nav>
</template>

<script>
import firebase from '../firebaseApp'

export default {
	name: 'navbar',
	computed: {
		currentUser: function() {
			if(this.$store.state.user) {
				return true;
			} else {
				return false;
			}
		},
		isVerified: function() {
			if(this.$store.state.user.emailVerified) {
				return true;
			} else {
				return false;
			}
		},
		displayName: function() {
			return this.$store.getters.userDisplayName;
		}
	},
	methods: {
		logOutUser: function() {
			firebase.auth().signOut().then(function() {
				//sign out success
				window.location.href = '/';
			}.bind(this), function(error) {
				//sign out failed
			});
			firebase.auth().onAuthStateChanged((user)=> {
				if (!user) {
					this.$store.commit('removeUserState');
				}
			});
		},
		sendEmailAgain: function() {
			firebase.auth().currentUser.sendEmailVerification().then(function() {
				console.log('email sent');
			}, function(error) {
				console.log(error.message);
			});
		}
	},
}

</script>

<style scoped lang="scss">
	.navbar {
		background-color: #16A086;
		display: flex;
		margin: 0;
		padding: 0;
		position: fixed;
		top: 0;
		width: 100%;
		height: 70px;
		z-index: 3;
		&__item {
			flex: 1 1 auto;
			position: relative;
			&:active {
				background-color: #16A086;
			}
		}
		&__text {
			color: white;
			font-family: Roboto;
			margin-right: -50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>