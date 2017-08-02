<template>
	<div class="reset-password">
		<div class="reset-password__label-wrapper">
			<label class="reset-password__label" for="password">Password</label><span class="reset-password__error-message">{{ errorMessage }}</span>
		</div>
		<input class="reset-password__input" type="password" name="password" v-model.trim="passwordForm">
		<button class="reset-password__button"
			@click="resetPassword">Reset Password</button>
		<router-link class="reset-password__link" to="/map">Return to app</router-link>
	</div>
</template>

<script>
import firebase from '../firebaseConfig'
import errorMessageHandler from '../helper'

export default {
	name: 'resetPassword',
	props: ['code'],
	data() {
		return {
			errorMessage: null,
			passwordForm: '',
		}
	},
	methods: {
		resetPassword() {
			if (this.passwordForm) {
				firebase.auth().verifyPasswordResetCode(this.code).then((email) => {

					firebase.auth().confirmPasswordReset(this.code, this.passwordForm).then((resp) => {

					}).catch((error) => {
						this.errorMessage = errorMessageHandler(error.code)
					})
				}).catch((error) => {
					this.errorMessage = errorMessageHandler(error.code)
				})
			} else {
				this.errorMessage = 'Please enter a new password.'
			}
		}
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

/**/
.reset-password {
	@include center;
	width: 290px;
	height: 100px;
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
	&__input {
		box-sizing: border-box;
		margin: 10px 0;
		width: 100%;
	}
	&__button {
		background-color: #00b27c;
		border: none;
		@include box-shadow;
		@include font-default(white, 15px);
		margin: 0 0 15px 50%;
		padding: 5px;
		transform: translate(-50%, 0);
		&:focus {
			outline-style: none;
		}
	}
	&__link {
		background-color: inherit;
		border: none;
		box-sizing: border-box;
		display: inline-block;
		@include font-default(blue, 15px);
		margin: 0 0 15px 50%;
		transform: translate(-50%, 0);
		padding: 0;
		text-align: right;
		&:focus {
			outline-style: none;
		}
	}
}
</style>