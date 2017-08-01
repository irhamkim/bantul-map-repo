<template>
	<div class="login-form">
		<transition name="fade">
			<div v-if="loading"
				class="login-form__loading">
				<span>Loading...</span>
			</div>
		</transition>
		<transition name="fade">
			<div v-if="!loading"
				class="login-form__form-group">
				<div class="login-form__input-wrapper">
					<div class="login-form__label-wrapper">
						<label class="login-form__label">Email</label>
						<div class="login-form__error-message">{{ errorMessage }}</div>
					</div>
					<input class="login-form__input login-form__input--email" type="email" v-model.trim="emailForm"/>
				</div>
				<div class="login-form__input-wrapper">
					<div class="login-form__label-wrapper">
						<label class="login-form__label">Password</label>
						<button class="login-form__link login-form__link--forgot"
							@click="openForgotPasswordForm">Forgot password?</button>
					</div>
					<input class="login-form__input login-form__input--password" type="password" v-model.trim="passwordForm"/>
				</div>
				<button class="login-form__button login-form__button--login" 
					v-on:click="logInUserWithProvider('email')">Login</button>
				<button class="login-form__link login-form__link--register"
					@click="openRegisterForm">Register a new account</button>
				<div class="login-form__divider">
					<span>Login with</span>
				</div>
				<div class="login-form__button-group">
					<button class="login-form__circle-button login-form__circle-button--google"
						@click="logInUserWithProvider('google')">Google</button>
					<button class="login-form__circle-button login-form__circle-button--facebook"
						@click="logInUserWithProvider('facebook')">Facebook</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
  import firebase from '../firebaseConfig'
  import errorMessageHandler from '../helper'

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
				
				firebase.auth().signInWithEmailAndPassword(this.emailForm, this.passwordForm).then(() => {
					this.$store.commit('closeForm')
				}).catch((error) => {
					this.errorMessage = errorMessageHandler(error.code)
					this.loading = false;
				});
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
			this.$store.commit('closeForm')
		},
		openRegisterForm() {
			this.$store.commit('openForm', 'registerForm')
		},
		openForgotPasswordForm() {
			this.$store.commit('openForm', 'forgotPasswordForm')
		},
	}	
  }
</script>

<style lang="scss">
@mixin box-shadow {
	box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
}
@mixin font-default($color, $size) {
	color: $color;
	font-family: Roboto, Helvetica;
	font-size: $size;
}
@mixin center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.login-form {
	width: 100%;
	height: 100%;
	&__loading {
		background-color: white;
		@include font-default(black, 18px);
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
	&__title {
		font-size: 21px;
		margin: 0;
		position: absolute;
		top: 55px;
		left: 50%;
		transform: translate(-50%, 0);
	}
	&__form-group {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		height: 220px;
	}
	&__input-wrapper {
		margin: 15px 0;
		&--email {}
		&--password {}
	}
	&__input {
		box-sizing: border-box;
		width: 100%;
	}
	&__label-wrapper {
		display: flex;
	}
	&__label {
		flex: 1 1 auto;
		@include font-default(black, 15px);
		width: 80px;
	}
	&__error-message {
		flex: 1 1 auto;
		@include font-default(red, 15px);
		text-align: right;
	}
	&__button {
		background-color: #00b27c;
		border: none;
		@include box-shadow;
		box-sizing: border-box;
		@include font-default(white, 15px);
		margin: 0 0 15px 50%;
		transform: translate(-50%, 0);
		width: 70px;
		height: 35px;
		&:focus {
			outline-style: none;
		}
	}
	&__link {
		background-color: inherit;
		border: none;
		box-sizing: border-box;
		@include font-default(blue, 15px);
		padding: 0;
		text-align: right;
		&:focus {
			outline-style: none;
		}
		&--register {
			margin: 0 0 15px 50%;
			transform: translate(-50%, 0);
		}
		&--forgot {
			flex: 1 1 auto;
		}
	}
	&__divider {
		background-color: white;
		box-sizing: border-box;
		@include font-default(#cccccc, 15px);
		margin-left: 50%;
		position: relative;
		text-align: center;
		transform: translate(-50%, 0);
		span {
			background-color: white;
			padding: 0 9px;
		}
		&::before {
			content: '';
			border-bottom: 2px solid #cccccc;
			@include center;
			width: 100%;
			z-index: -1;
		}
	}
	&__button-group {
		box-sizing: border-box;
		margin: 15px 0;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);
	}
	&__circle-button {
		background-color: white;
		border: 1px solid #00b27c;
		border-radius: 50%;
		width: 70px;
		height: 70px;
		&:focus {
			outline-style: none;
		}
		&--google {
		}
		&--facebook {
		}
	}
}
</style>