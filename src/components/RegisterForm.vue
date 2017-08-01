<template>
	<div class="register-form">
		<transition name="fade">
			<div v-if="loading" class="register-form__loading">
				<span>Loading</span>
			</div>
		</transition>
		<transition name="fade">
			<div v-if="!loading" class="register-form__form-group">
				<div class="register-form__input-wrapper">
					<div class="register-form__label-wrapper">
						<label class="register-form__label">Email</label>
						<div class="register-form__error-message">{{ errorMessage }}</div>
					</div>
					<input class="register-form__input" type="email" v-model.trim="emailForm"/>
				</div>
				<div class="register-form__input-wrapper">
					<div class="register-form__label-wrapper">
						<label class="register-form__label">Username</label>
					</div>
					<input class="register-form__input" type="text" v-model.trim="usernameForm"/>
				</div>
				<div class="register-form__input-wrapper">
					<div class="register-form__label-wrapper">
						<label class="register-form__label">Password</label>
					</div>
					<input class="register-form__input" type="password" v-model.trim="passwordForm"/>
				</div>
				<div class="register-form__input-wrapper">
					<div class="register-form__label-wrapper">
						<label class="register-form__label">Confirm Password</label>
					</div>
					<input class="register-form__input" type="password" v-model.trim="confirmPasswordForm"/>
				</div>
				<button class="register-form__button register-form__button--register" 
					v-on:click="registerUser">Register</button>
				<button class="register-form__link register-form__link--login"
					@click="openLoginForm">Login with existing account</button>
			</div>
		</transition>
	</div>
</template>

<script>
import firebase from '../firebaseConfig'
import errorMessageHandler from '../helper'

export default {
	name: 'registerForm',
	data: function () {
		return {
			loading: false,
			emailForm: '',
			usernameForm: '',
			passwordForm: '',
			reconfirmPassword: false,
			confirmPasswordForm: '',
			errorMessage: ''
		}
	},
	methods: {
		registerUser: function() {
			this.errorMessage = null
			if (this.emailForm && this.usernameForm && this.passwordForm) {	
				if (this.passwordForm.length >= 6) {
					if (this.passwordForm === this.confirmPasswordForm) { //check if password form value === confirm password form value
						this.loading = true;
						firebase.auth().createUserWithEmailAndPassword(this.emailForm, this.passwordForm).then(() => {
							firebase.auth().onAuthStateChanged((user) => {
								if (user) {
									user.updateProfile({
										displayName: this.usernameForm
									})
									this.$store.commit('setUserState', user)
								}
								this.$store.commit('closeForm');
							})
						}).catch((error) => {
							this.errorMessage = errorMessageHandler(error.code)
							this.loading = false;
						});
						
					} else { //if password different, warn user to enter correct password
						this.errorMessage =  'Password you entered didn\'t match';
					}
				} else {
					this.errorMessage = 'Password has to be 6 characters or more';
				}
			} else {
				this.errorMessage = 'Email, username, and password can\'t be empty';
			}


		},
		openLoginForm() {
			this.$store.commit('openForm', 'loginForm')
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

.register-form {
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
		&--login {
			margin-left: 50%;
			transform: translate(-50%, 0);
		}
	}
}
</style>