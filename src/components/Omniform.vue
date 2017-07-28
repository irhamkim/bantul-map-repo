<template>
	<div class="omniform">
		<login-form v-if="openForm === 'loginForm'"></login-form>
		<register-form v-if="openForm === 'registerForm'"></register-form>
		<review-form v-if="openForm === 'reviewForm'"></review-form>
	</div>
</template>

<script>
import LoginForm from './LoginForm'
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
		RegisterForm: () => import('./RegisterForm'),
		ReviewForm: () => import('./ReviewForm'),
	}
}
</script>

<style lang="scss">
.omniform {
	
}
</style>