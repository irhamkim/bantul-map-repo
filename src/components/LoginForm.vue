<template>
	<div class="login-form">
		<div v-if="loading"
			class="login-form__loading">
			<span>Loading...</span>
		</div>
		<template v-else>
			<div class="login-form__header">
				<h2 class="login-form__title">Login</h2>
				<button class="login-form__flat-button login-form__flat-button--close"
					@click="closeLoginForm">X</button>
				<div class="login-form__error-message"
					v-show="errorMessage">{{ errorMessage }}</div>
			</div>
			<div class="login-form__form">	
				<div class="login-form__input login-form__input--email">
					<label>Email </label>:
					<input type="email" v-model.trim="emailForm"/>
				</div>
				<div class="login-form__input login-form__input--password">
					<label>Password </label>:
					<input type="password" v-model.trim="passwordForm"/>
				</div>
				<button class="login-form__button login-form__button--login" 
					v-on:click="logInUserWithProvider('email')">Login</button>
				<div class="login-form__link">
					<router-link to="forgot">Forgot Your Password?</router-link>
				</div>
				<div class="login-form__button-group">
					<button class="login-form__circle-button login-form__button--google"
						@click="logInUserWithProvider('google')">Google</button>
					<button class="login-form__circle-button login-form__button--facebook"
						@click="logInUserWithProvider('facebook')">Facebook</button>
				</div>
			</div>
		</template>
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

<style lang="scss">
	.login-form {
		background-color: white;
		-webkit-box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		-moz-box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		font-family: Roboto, Helvetica;
		font-size: 17px;
		padding: 15px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 500px;
		height: 400px;
		z-index: 2;
		&__loading {
			background-color: white;
			position: relative;
			width: 100%;
			height: 100%;
			z-index: 3;
			span {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
		&__header {
			width: 100%;
			height: 25%;
			top: 15px;
		}
		&__title {
			font-size: 21px;
			margin: 0;
			position: absolute;
			top: 55px;
			left: 50%;
			transform: translate(-50%, 0);
		}
		&__flat-button {
			background-color: white;
			border: none;
			color: gray;
			&--close {
				position: absolute;
				right: 15px;
			}
		}
		&__form {
			padding-top: 15px;
		}
		&__input {
			margin: 10px 0;
			label {
				display: inline-block;
				width: 100px;
			}
			input {
				width: 300px;
			}
			&--email {}
			&--password {}
		}
		&__button {
			background-color: teal;
			border: none;
			color: white;
			margin-left: 50%;
			transform: translate(-50%, 0);
			width: 70px;
			height: 35px;
		}
		&__link {
			display: inline-block;
			margin-top: 10px;
			margin-bottom: 10px;
			margin-left: 50%;
			transform: translate(-50%, 0);
		}
		&__button-group {
			position: absolute;
			left: 50%;
			transform: translate(-50%, 0);
		}
		&__circle-button {
			background-color: white;
			border: 1px solid teal;
			border-radius: 50%;
			width: 70px;
			height: 70px;
			&--google {

			}
		}
	}
</style>