<template>
	<div class="review-form">
		<div class="review-form__header">
			<button class="review-form__flat-button review-form__flat-button--close"
				@click="closeReviewForm">
			</button>
		</div>
		<div class="review-form__wrapper">
			<div class="review-form__character-limit">
				<span :class="{'review-form__character-limit--is-on-limit': characterLimit }">{{ totalCharacters }}</span>
			</div>
			<template v-if="contentEdit.content">
				<textarea class="review-form__input" type="text"
					v-model.trim="contentEdit.content"
					maxlength="160">
				</textarea>
				<button class="review-form__float-button" @click="editReview">Submit</button>
			</template>
			<template v-else>
				<textarea class="review-form__input" type="text"
					v-model.trim="content"
					maxlength="160" >
				</textarea>
				<button class="review-form__float-button" @click="submitReview">Submit</button>
			</template>
		</div>
	</div>
</template>

<script>import firebase from '../firebaseConfig'

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
		totalCharacters() {
			if (this.content  || this.contentEdit.content) {
				let c = this.content ? this.content.length : this.contentEdit.content.length
				return c
			} else {
				return 0
			}
		},
		characterLimit() {
			return this.totalCharacters >= 160 ? true : false
		}
	},
	methods: {
		closeReviewForm() {
			this.$store.commit('closeForm')
		},
		submitReview() {
			if (this.content && (this.content.length <= 160)) {
				this.$firebaseRefs.locationReviews.child(this.$store.state.user.uid).set({ 
					content: this.content,
					submitTime: firebase.database.ServerValue.TIMESTAMP,
					submittedBy: this.$store.state.user.providerData[0].displayName
				})
				firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.location).set({
					content: this.content,
					submitTime: firebase.database.ServerValue.TIMESTAMP
				})
				this.$store.commit('closeForm')
			} else {
				this.$store.commit('closeForm')
			}
		},
		editReview() {
			if (this.contentEdit.content && (this.contentEdit.content.length <= 160)) {
				this.$firebaseRefs.locationReviews.child(this.$store.state.user.uid).set({ 
					content: this.contentEdit.content,
					submitTime: firebase.database.ServerValue.TIMESTAMP,
					submittedBy: this.$store.state.user.providerData[0].displayName
				})
				firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.location).set({
					content: this.contentEdit.content,
					submitTime: firebase.database.ServerValue.TIMESTAMP
				})
				this.$store.commit('closeForm')
			} else {
				this.$store.commit('closeForm')
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
		@inlcude box-shadow;
		box-sizing: border-box;
		overflow: hidden;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 500px;
		height: 400px;
		z-index: 5;
		@media (max-width: 429px) {
			box-shadow: none;
			width: 100%;
			min-height: 100%;
			top: 0;
			left: 0;
			transform: none;
		}
		&__header {
			background-color: #00b27c;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 30px;
			@media (max-width: 429px) {
				height: 50px;
			}
		}
		&__wrapper {
			position: absolute;
			top: 55%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 350px;
			height: 220px;
			&::before {
				content: 'Write a review';
				@include font-default(black, 17px);
				height: 25px;
			}
			&::after {
				content: '/160';
				@include font-default(black, 17px);
				position: absolute;
				top: 0;
				right: 0;
			}
		}
		&__character-limit {
			position: absolute;
			@include font-default(black, 17px);
			top: 0;
			right: 37px;
			&--is-on-limit {
				@include font-default(red, 17px);
			}
		}
		&__input {
			background-color: rgba(100, 100, 100, 0.25);
			border: 2px solid #00b27c;
			box-sizing: border-box;
			@include font-default(black, 17px);
			padding: 2px;
			resize: none;
			width: 350px;
			height: 150px;
			&:focus {
				outline-style: none;
			}
		}
		&__flat-button {
			border: none;
			&--close {
				background-color: #00b27c;
				position: absolute;
				top: 50%;
				right: 5px;
				transform: translate(-50%, -50%);
				width: 15px;
				height: 15px;
				&::before {
					background: url(../assets/cancel-white.svg);
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
		&__float-button {
			background-color: #00b27c;
			border: none;
			@include box-shadow;
			box-sizing: border-box;
			color: white;
			@include font-default(white, 17px);
			padding: 5px;
			position: absolute;
			right: 0;
			bottom: 0;
			&:focus {
				outline-style: none;
			}
		}
	}

</style>