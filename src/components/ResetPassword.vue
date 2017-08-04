<template>
	<div class="reset-password">
			<div v-if="loading && !success" class="transition-wrapper">
				<div class="reset-password__loading-overlay">
					<span>Loading...</span>
				</div>
			</div>
			<div v-if="success && !loading" class="transition-wrapper">
				<div class="reset-password__message">
					<span class="overlay-message">Your password have been reset.</span>
				</div>
				<router-link class="reset-password__link" to="/map">Return to app</router-link>
			</div>
			<div v-if="!loading && !success" class="transition-wrapper">
				<div class="reset-password__label-wrapper">
					<label class="reset-password__label" for="password">New password</label>
					<span class="reset-password__error-message">{{ errorMessage }}</span>
				</div>
				<input class="reset-password__input" type="password" name="password" v-model.trim="passwordForm">
				<button class="reset-password__button"
						@click="resetPassword">Reset Password</button>
				<router-link class="reset-password__link" to="/map">Return to app</router-link>
			</div>
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
			loading: false,
			success: false,
			errorMessage: null,
			passwordForm: '',
		}
	},
	methods: {
		resetPassword() {
			this.loading = true
			/*
			if (this.passwordForm) {
				this.loading = true

				firebase.auth().verifyPasswordResetCode(this.code).then((email) => {
					firebase.auth().confirmPasswordReset(this.code, this.passwordForm).then((resp) => {
						this.success = true
						this.loading = false
					}).catch((error) => {
						this.errorMessage = errorMessageHandler(error.code)
						this.loading = false
					})
				}).catch((error) => {
					this.errorMessage = errorMessageHandler(error.code)
					this.loading = false
				})
			} else {
				this.errorMessage = 'Please enter a new password.'
			}
			*/
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
.transition-wrapper {
	width: 100%;
	height: 100%;
}

.reset-password {
	@include center;
	width: 300px;
	height: 140px;
	&__loading-overlay {
		background-color: white;
		@include font-default(black, 15px);
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 3;
		span {
			@include center;
		}
	}
	&__message {
		@include font-default(black, 15px);
		@include center;
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
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 0);
		padding: 0;
		text-align: right;
		&:focus {
			outline-style: none;
		}
	}
}
</style>