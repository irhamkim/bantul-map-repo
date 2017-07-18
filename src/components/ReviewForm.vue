<template>
	<div class="review-form">
			<button @click="closeReviewForm">X</button>
		<template v-if="isEditMode">
		<input type="text" v-model.trim="contentEdit.content">
			<button @click="editReview">Submit</button>
		</template>
		<template v-else>
			<input type="text" v-model.trim="content">
			<button @click="submitReview">Submit</button>
		</template>
	</div>
</template>

<script>
import firebase from '../firebaseApp'

export default {
	name: 'reviewForm',
	data() {
		return {
			content: null,
			contentEdit: null
		}
	},
	firebase() {
		return {
			locationReviews: {
				source: firebase.database().ref('locations').child(this.$route.query.location).child('reviews')
			},
			contentEdit: {
				source: firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.location),
				asObject: true
			}
		}
	},
	computed: {
		isEditMode() {
			return this.contentEdit ? true : false
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
				firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.location).set({
					content: this.content,
					submitTime: firebase.database.ServerValue.TIMESTAMP
				})
				this.$emit('close-review-form')
			} else {
				this.$emit('close-review-form')
			}
		},
		editReview() {
			if (this.contentEdit.content) {
				this.$firebaseRefs.locationReviews.child(this.$store.state.user.uid).set({ 
					content: this.contentEdit.content,
					submitTime: firebase.database.ServerValue.TIMESTAMP,
					submittedBy: this.$store.state.user.providerData[0].displayName
				})
				firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.location).set({
					content: this.contentEdit.content,
					submitTime: firebase.database.ServerValue.TIMESTAMP
				})
				this.$emit('close-review-form')
			} else {
				this.$emit('close-review-form')
			}
		}
	}
}

</script>

<style lang="scss">
	.review-form {
		background-color: white;
		-webkit-box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		-moz-box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 400px;
		height: 300px;
		z-index: 2;
	}
</style>