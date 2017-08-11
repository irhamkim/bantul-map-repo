<template>
	<div class="auth">
		<reset-password v-if="mode === 'resetPassword'"
			:code="code"></reset-password>
		<verify-email v-if="mode === 'verifyEmail'"
			:code="code"></verify-email>
	</div>
</template>

<script>
import firebase from '../firebaseConfig'
import ResetPassword from './ResetPassword'
import VerifyEmail from './VerifyEmail'

export default {
	name: 'auth',
	data() {
		return {
			mode: this.$route.query.mode,
			code: this.$route.query.oobCode,
		}
	},
	components: {
		ResetPassword: () => import('./ResetPassword'),
		VerifyEmail: () => import('./VerifyEmail'),
	}
}
</script>

<style lang="scss">
.auth {
	width: 100%;
	height: 100%;
}
</style>