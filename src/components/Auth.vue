<template>
	<div class="auth">
		<reset-password v-if="mode === 'resetPassword'"
			:code="code"></reset-password>
	</div>
</template>

<script>
import ResetPassword from './ResetPassword'

export default {
	name: 'auth',
	beforeMount() {
	},
	data() {
		return {
			mode: this.$route.query.mode,
			code: this.$route.query.oobCode,
		}
	},
	components: {
		ResetPassword: () => import('./ResetPassword')
	}
}
</script>

<style lang="scss">
.auth {
	width: 100%;
	height: 100%;
}
</style>