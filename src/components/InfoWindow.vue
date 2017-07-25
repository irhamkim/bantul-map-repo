<template>
	<div class="info-tab">
		<div class="info-tab__head">
			<div class="info-tab__head__section">
				<div class="info-tab__head__title">
					{{ locationData.name }}
				</div>
				<button class="info-tab__head__flat-button info-tab__head__flat-button--close"
					@click="closeInfoWindow">
				</button>
			</div>
			<div class="info-tab__head__image">
				This is a placeholder image for location {{ this.$route.query.location }}
			</div>
			<div class="info-tab__head__section info-tab__head__section--bottom">
				<div class="info-tab__head__title">
					{{ locationData.address }}
				</div>
			</div>
		</div>
		<div class="info-tab__reviews">
			<div v-if="!isLoggedIn"
				class="info-tab__reviews__section">
				<button class="info-tab__float-button info-tab__float-button--login"
					@click="openLoginForm">Login</button>
			</div>
			<div v-if="isLoggedIn && !currentUserReviewed"
				class="info-tab__reviews__section">
				<button class="info-tab__float-button info-tab__float-button--write"
					@click="openReviewForm">Write Review</button>
			</div>
			<div v-if="currentUserReviewed"
				class="info-tab__reviews__section">
				<div class="info-tab__reviews__user-review">{{ userReview.content }}</div>
				<button class="info-tab__float-button info-tab__float-button--edit"
					@click="openReviewForm">Edit</button>
				<button class="info-tab__float-button info-tab__float-button--delete"
					@click="deleteReview">Delete</button>
			</div>
			<div v-for="(review, index) in orderedReviews" :key="index"
				class="info-tab__review-item">
				<span class="info-tab__review-item__user">{{ review.submittedBy }}</span>
				<span class="info-tab__review-item__content">{{ review.content }}</span>
				<span class="info-tab__review-item__time">{{ submitTime(review.submitTime) }}</span>
			</div>
		</div>
		<button class="info-tab__flat-button info-tab__flat-button--bottom"
			@click="openReviewWindow">
			More Reviews
		</button>
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
		mounted() {
			let h = this.$el.clientHeight
			this.$emit('set-height', h)
		},
		updated() {
			let h = this.$el.clientHeight
			this.$emit('set-height', h)
		},
		destroyed() {
			this.$emit('set-height', null)
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
				let arr = this.locationReviews.sort((a, b) => {
					return b.submitTime - a.submitTime
				})

				return arr.slice(0,2)
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
				this.$store.commit('openForm', 'reviewForm')
			},
			openLoginForm() {
				this.$store.commit('openForm', 'loginForm')
			},
			deleteReview() {
				this.$firebaseRefs.userReview.remove()
				this.$firebaseRefs.locationReviews.child(this.$store.state.user.uid).remove()
			},
			openReviewWindow() {
				this.$store.commit('openWindow', 'reviewWindow')
			},
			closeInfoWindow() {
				this.$store.commit('closeInfoWindow')
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

.info-tab {
	background-color: white;
	position: absolute;
	width: 430px;
	min-height: 100vh;
	z-index: 4;
	@media (max-width : 429px) {
		width: 100%;
	}
	&__head {
		width: 100%;
		height: 300px;
		&__section {
			background-color: #00b27c;
			position: relative;
			width: 100%;
			height: 50px;
			&--bottom {
				@include box-shadow;
			}
		}
		&__image {
			width: 100%;
			height: 200px;
		}
		&__title {
			color: white;
			@include font-default(white, 17px);
			position: absolute;
			top: 15px;
			left: 5px;
		}
		&__flat-button {
			background-color: #00b27c;
			border: none;
			color: white;
			font-size: 22px;
			&:focus {
				outline-style: none;
			}
			&--close {
				position: absolute;
				top: 50%;
				right: 20px;
				transform: translate(0, -50%);
				&::before {
					background: url(../assets/cancel-white.svg);
					background-size: 20px;
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 20px;
					height: 20px;
				}
			}
		}
	}
	&__reviews {
		position: relative;
		width: 100%;
		&__section {
			border-bottom: 3px solid #00b27c;
			position: relative;
			width: 100%;
			height: 200px;
			&::after {
				content: 'Reviews';
				@include font-default(#00b27c, 20px);
				position: absolute;
				bottom: 0px;
				left: 10px;
			}
		}
		&__user-review {
			@include font-default(black, 15px)
			position: absolute;
			top: 15%;
			left: 50%;
			transform: translate(-50%, 0);
			width: 350px;
			text-align: justify;
			word-wrap: break-word;
		}
	}
	&__float-button {
		background-color: #00b27c;
		border: none;
		@include box-shadow;
		box-sizing: border-box;
		color: white;
		@include font-default(white, 17px);
		padding: 5px 7px;
		&:focus {
			outline-style: none;
		}
		&--write {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		&--login {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 65px;
		}
		&--edit {
			position: absolute;
			top: 70%;
			left: 35%;
			transform: translate(-50%, -50%);
			width: 65px;
		}
		&--delete {
			position: absolute;
			top: 70%;
			left: 65%;
			transform: translate(-50%, -50%);
			width: 65px;
		}
	}
	&__review-item {
		border-bottom: 2px solid rgba(0, 0, 0, 0.1);
		position: relative;
		width: 100%;
		height: 100px;
		&__user {
			@include font-default(black, 15px);
			font-weight: 700;
			position: absolute;
			top: 5px;
			left: 10px;
		}
		&__content {
			@include font-default(black, 15px);
			position: absolute;
			top: 22px;
			left: 10px;
			width: 400px;
			word-wrap: break-word;
		}
		&__time {
			@include font-default(#00b27c, 9px);
			position: absolute;
			right: 10px;
			bottom: 5px;
		}
	}
	&__flat-button {
		background-color: white;
		border: none;
		@include font-default(#00b27c, 17px);
		&:focus {
			outline-style: none;
		}
		&--bottom {
			position: absolute;
			bottom: 5px;
			left: 50%;
			transform: translate(-50%, 0);
			width: 100%;
		}
	}
}
</style>