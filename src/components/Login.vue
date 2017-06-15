<template>
	<div class="form-login">
		<div v-if="loading" class="modal-loading-white">
			<img class="loader-img" src="/img/loader-gray.svg">
		</div>
		<div>Login</div>
		<div v-show="this.errorMsg">{{ errorMsg }}</div>
		<div class="input-login"><label>Email </label>: <input type="email" v-model.trim="emailForm"/></div><br>
		<div class="input-login"><label>Password </label>: <input type="password" v-model.trim="passwordForm"/></div><br>
		<button v-on:click="logInUserWithProvider('email')">Login</button><br>
		<div><router-link to="forgot">Forget Your Password?</router-link></div>
		<button v-on:click="logInUserWithProvider('google')">Google</button>
		<button v-on:click="logInUserWithProvider('facebook')">Facebook</button>
	</div>
</template>

<script>
  import firebase from '../firebaseApp.js'
  export default {
	name: 'loginForm',
	beforeMount: function() {
		this.loading = true;
		firebase.auth().getRedirectResult().then((result)=> {
			if (result.user) {
				router.push('/');
			} else {
			}
		}, (error)=> {

		});
		this.loading = false;
	},
	data: function () {
		return {
			emailForm:'',
			passwordForm: '',
			errorMsg: '',
			loading: false
		}
	},
	methods: {
		logInUserWithEmail: function() {
			if (this.emailForm && this.passwordForm) {
				this.loading = true;
				firebase.auth().signInWithEmailAndPassword(this.emailForm, this.passwordForm).catch(function (error) {
					this.errorMsg = error.message;
					this.loading = false;
				}.bind(this));
			} else {
				this.errorMsg = 'Email and password can\'t be empty';
			}
		},
		logInUserWithProvider: function(provider) {
			if (provider == 'google') {
				var authProvider = new firebase.auth.GoogleAuthProvider();
				this.loading = true;
				firebase.auth().signInWithRedirect(authProvider);
			} else if (provider == 'facebook') {
				var authProvider = new firebase.auth.FacebookAuthProvider();
				this.loading = true;
				firebase.auth().signInWithRedirect(authProvider);
			} else if (provider == 'email') {
				this.logInUserWithEmail();
			}

			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {					
					this.emailForm = '';
					this.passwordForm = '';
					this.$emit('login');
					router.push('/');
				}
			}.bind(this));
		}
	}	
  }
</script>

<style>
	
</style>