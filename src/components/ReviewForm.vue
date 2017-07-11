<template>
	<div class="review-form">
		<button @click="closeReviewForm">X</button>
		<input type="text" v-model.trim="content">
		<button @click="submitReview">Submit</button>
	</div>
</template>

<script>
import firebase from '../firebaseApp'

export default {
	name: 'reviewForm',
	data() {
		return {
			content: null
		}
	},
	firebase() {
		return {
			locationReviews: {
				source: firebase.database().ref('locations').child(this.$route.query.location).child('reviews')
			}
		}
	},
	methods: {
		closeReviewForm() {
			this.$emit('close-review-form')
		},
		submitReview() {
			if (this.content) {
				this.$firebaseRefs.locationReviews.child(this.$store.state.user.uid).set({ 
					content: this.content,
					submitTime: firebase.database.ServerValue.TIMESTAMP,
					submittedBy: this.$store.state.user.providerData[0].displayName
				})
			}
		}
	}
}

</script>

<style>
	.review-form {
		background-color: white;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
	}
</style>