<template>
	<div class="login">
		<div v-if="loading">
			Loading...
		</div>
		<div>Login</div>
		<button @click="closeLoginForm">X</button>
		<div v-show="errorMessage">{{ errorMessage }}</div>
		<div><label>Email </label>: <input type="email" v-model.trim="emailForm"/></div><br>
		<div><label>Password </label>: <input type="password" v-model.trim="passwordForm"/></div><br>
		<button v-on:click="logInUserWithProvider('email')">Login</button><br>
		<div><router-link to="forgot">Forget Your Password?</router-link></div>
		<button v-on:click="logInUserWithProvider('google')">Google</button>
		<button v-on:click="logInUserWithProvider('facebook')">Facebook</button>
	</div>
</template>

<script>
  import firebase from '../firebaseApp'
  export default {
	name: 'loginForm',
	data: function () {
		return {
			emailForm:'',
			passwordForm: '',
			errorMessage: '',
			loading: false
		}
	},
	methods: {
		logInUserWithEmail: function() {
			if (this.emailForm && this.passwordForm) {
				this.loading = true;
				firebase.auth().signInWithEmailAndPassword(this.emailForm, this.passwordForm).catch(function (error) {
					this.errorMessage = error.message;
					this.loading = false;
				}.bind(this));
			} else {
				this.errorMessage = 'Email and password can\'t be empty';
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
		},
		closeLoginForm() {
			this.$emit('close-login-form')
		}
	}	
  }
</script>

<style>
.login {
	background-color: white;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 500px;
	height: 400px;
	z-index: 2;
}
</style>