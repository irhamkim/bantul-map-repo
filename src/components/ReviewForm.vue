<template>
	<div class="review-form">
		<div class="review-form__header"></div>
			<button @click="closeReviewForm">X</button>
		<div v-if="contentEdit" class="review-form__wrapper">
			<input class="review-form__input" type="text" v-model.trim="contentEdit.content">
			<button class="review-form__floating-button" @click="editReview">Submit</button>
		</div>
		<div v-else class="review-form__wrapper">
			<input class="review-form__input" type="text" v-model.trim="content">
			<button class="review-form__float-button" @click="submitReview">Submit</button>
		</div>
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
	methods: {
		closeReviewForm() {
			this.$store.commit('closeForm')
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
				this.$store.commit('openWindow', 'infoWindow')
			} else {
				this.$store.commit('openWindow', 'infoWindow')
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
				this.$store.commit('openWindow', 'infoWindow')
			} else {
				this.$store.commit('openWindow', 'infoWindow')
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

	.review-form {
		background-color: white;
		box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		box-sizing: border-box;
		overflow: hidden;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 400px;
		height: 300px;
		z-index: 3;
		@media (max-width: 429px) {
			box-shadow: none;
			width: 100%;
			min-height: 100%;
			top: 0;
			left: 0;
			transform: none;
		}
		&__wrapper {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		&__input {
			border: 2px solid #00b27c;
			&:focus {
				outline-style: none;
			}
		}
		&__float-button {
			background-color: #00b27c;
			border: none;
			@include box-shadow;
			color: white;
			@include font-default(white, 17px);
			&:focus {
				outline-style: none;
			}
		}
	}	
</style>