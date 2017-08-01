<template>
	<div class="forgot">
		<transition name="fade">
			<div v-if="loading" class="forgot__loading-overlay">
				<span>Loading...</span>
			</div>
		</transition>
		<transition name="fade">
			<div v-if="success" class="forgot__message">
				<span class="overlay-message">We've sent a password reset email to the following email address</span>
				<br>
				<span class="forgot__email">{{ emailForm }}</span>
			</div>
		</transition>
		<transition>
			<div v-if="!loading && !success" class="forgot__form-group">
				<div class="forgot__input-wrapper forgot__input-wrapper--email">
					<div class="forgot__label-wrapper">
						<label class="forgot__label">Email</label>
						<div class="forgot__error-message">{{ errorMessage }}</div>
					</div>
					<input class="forgot__input forgot__input--email" type="email" v-model.trim="emailForm"/>
				</div>
				<button class="forgot__button"
					@click="sendPasswordResetEmail">Submit</button>
				<button class="forgot__link"
					@click="openLoginForm">Login</button>
			</div>
		</transition>
	</div>
</template>

<script>
import firebase from '../firebaseConfig'
import errorMessageHandler from '../helper'

export default {
	name: 'forgotPassword',
	data() {
		return {
			loading: false,
			success: false,
			errorMessage: null,
			emailForm: null,
		}
	},
	methods: {
		sendPasswordResetEmail() {
			if (this.emailForm) {
				this.loading = true
				firebase.auth().sendPasswordResetEmail(this.emailForm).then(() => {
					this.success = true
					this.loading = false
				}).catch((error) => {
					this.errorMessage = errorMessageHandler(error.code)
					this.loading = false
				})
			} else {
				this.errorMessage = 'Email mustn\'t be empty.';
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

/** **/
.forgot {
	width: 100%;
	height: 100%;
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
		@include center;
		z-index: 3;
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
		&--email {
		}
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