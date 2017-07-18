<template>
	<div class="info-tab">
		<div class="info-tab__head">
			<div class="info-tab__head__section"></div>
			<div class="info-tab__head__image">
				This is a placeholder image for location {{ this.$route.query.location }}
			</div>
			<div class="info-tab__head__section info-tab__head__section--bottom">
				<div class="info-tab__head__title">
					{{ locationData.name }}
				</div>
			</div>
		</div>
		<div class="info-tab__reviews">
			<div v-if="!isLoggedIn"
				class="info-tab__reviews__section">
				<button class="info-tab__button info-tab__button--login"
					@click="openLoginForm">Login</button>
			</div>
			<div v-if="isLoggedIn && !currentUserReviewed"
				class="info-tab__reviews__section">
				<button class="info-tab__button info-tab__button--write"
					@click="openReviewForm">Write Review</button>
			</div>
			<div v-if="currentUserReviewed"
				class="info-tab__reviews__section">
				{{ userReview.content }}
				<button class="info-tab__button info-tab__button--edit"
					@click="openReviewForm">Edit</button>
				<button class="info-tab__button info-tab__button--delete"
					@click="deleteReview">Delete</button>
			</div>
			<div v-for="(review, index) in orderedReviews" :key="index"
				class="">
				<span>{{ review.submittedBy }}</span>
				<span>{{ review.content }}</span>
				<span>{{ submitTime(review.submitTime) }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import firebase from '../firebaseApp'
import * as moment from 'moment'

export default {
		name: 'infoWindow',
		beforeMount() {
			if (this.$store.state.user) {
				this.$bindAsObject('userReview', firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.location))
			}
		},
		data() {
			return {
				locationReviews: []
			}
		},
		firebase() {
			return {				
				locationData: {
					source: firebase.database().ref('locations').child(this.$route.query.location),
					asObject: true
				},
				locationReviews: {
					source: firebase.database().ref('locations').child(this.$route.query.location).child('reviews')
				}
			}
		},
		computed: {
			orderedReviews() {
				return this.locationReviews.sort((a, b) => {
					return b.submitTime - a.submitTime
				})
			},
			isLoggedIn() {
				return this.$store.state.user ? true : false
			},
			currentUserReviewed() {
				if (this.$store.state.user) {
					let val
					this.$firebaseRefs.locationReviews.on('value', (snapshot) => {
						if (snapshot.hasChild(this.$store.state.user.uid)) {
							val = true
						} else {
							val = false
						}
					})
					return val
				} else {
					return false
				}

			}
		},
		methods: {
			submitTime(time) {
				return moment(time).calendar()
			},
			openReviewForm() {
				this.$emit('open-review-form')
			},
			openLoginForm() {
				this.$emit('open-login-form')
			},
			deleteReview() {
				this.$firebaseRefs.userReview.remove()
				this.$firebaseRefs.locationReviews.child(this.$store.state.user.uid).remove()
			}
		}
}
</script>

<style lang="scss">
@mixin box-shadow {
	-webkit-box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
	-moz-box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
	box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
}
@mixin font-default($color, $size) {
	color: $color;
	font-family: Roboto, Helvetica;
	font-size: $size;
}

.info-tab {
	background-color: white;
	margin-left: 0;
	position: absolute;
	top: 0;
	left: 0;
	width: 430px;
	height: 100%;
	z-index: 1;
	&__head {
		width: 100%;
		height: 340px;
		&__section {
			background-color: #00b27c;
			width: 100%;
			height: 50px;
			&--bottom {
				@include box-shadow;
				position: relative;
			}
		}
		&__image {
			width: 100%;
			height: 240px;
		}
		&__title {
			color: white;
			@include font-default(white, 17px);
			position: absolute;
			top: 15px;
			left: 5px;
		}
	}
	&__reviews {
		width: 100%;
		height: calc(100% - 340px);
		&__section {
			position: relative;
			width: 100%;
			height: 120px;
		}
	}
	&__button {
		background-color: #00b27c;
		border: none;
		@include box-shadow;
		color: white;
		@include font-default(white, 17px);
		&:active, &:focus {
			outline-style: none;
		}
		&--write {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 90px;
			height: 50px;
		}
		&--login {
			@extend .info-tab__button--write;
		}
	}
}
</style>