<template>
	<div class="verify-email">
		<div v-if="isVerified" class="verify-email__message">{{ message }}</div>
		<div v-else class="verify-email__message"></div>
	</div>
</template>

<script>
import firebase from '../firebaseConfig'
import { errorMessageHandler } from '../helper'

export default {
	name: 'verifyEmail',
	props: ['code'],
	beforeMount() {
		this.verify()
	},
	data() {
		return {
			isVerified: false,
			message: '',
		}
	},
	methods: {
		verify() {
			firebase.auth().applyActionCode(this.code).then((resp) => {

			}).catch((error) => {
				this.message = errorMessageHandler(error.code)

			})
		},
		checkLoggedInUser() {
			firebase.auth().currentUser.sendEmailVerification().then().catch()
		},
	}
}
</script>

<style lang="scss">
	
</style>