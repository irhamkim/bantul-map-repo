<template>
	<div class="omniform">
		<button class="omniform__flat-button omniform__flat-button--close"
			@click="closeForm"></button>
		<transition name="fade">
			<login-form v-if="openForm === 'loginForm'"></login-form>
		</transition>
		<transition name="fade">
			<forgot-password v-if="openForm === 'forgotPasswordForm'"></forgot-password>
		</transition>
		<transition name="fade">
			<register-form v-if="openForm === 'registerForm'"></register-form>
		</transition>
		<transition name="fade">
			<review-form v-if="openForm === 'reviewForm'"></review-form>
		</transition>
	</div>
</template>

<script>
import LoginForm from './LoginForm'
import ForgotPasswordForm from './ForgotPassword'
import RegisterForm from './RegisterForm'
import ReviewForm from './ReviewForm'

export default {
	name: 'omniform',
	computed: {
		openForm() {
			return this.$store.state.openForm
		},
	},
	components: {
		LoginForm: () => import('./LoginForm'),
		ForgotPassword: () => import('./ForgotPassword'),
		RegisterForm: () => import('./RegisterForm'),
		ReviewForm: () => import('./ReviewForm'),
	},
	methods: {
		closeForm() {
			this.$store.commit('closeForm')
		}
	}
}
</script>

<style lang="scss">
.omniform {
	background-color: white;
	border-radius: 5px;
	box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
	box-sizing: border-box;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 500px;
	height: 400px;
	z-index: 5;
	@media (max-width: 429px) {
		border-radius: 0;
		box-shadow: none;
		width: 100%;
		min-height: 100%;
		top: 0;
		left: 0;
		transform: none;
	}
	&__flat-button {
		background-color: white;
		border: none;
		&--close {
			position: absolute;
			top: 15px;
			right: 15px;
			width: 15px;
			height: 15px;
			&::before {
				background: url(../assets/cancel-black.svg);
				background-size: 15px;
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 15px;
				height: 15px;
			}
			}
			&:focus {
				outline-style: none;
			}
		}
}
</style>