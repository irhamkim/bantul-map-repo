<template>
	<div class="wrapper">
		<div v-bar="{el1Class: 'el1', el2Class: 'info-tab'}"
			style="width: 430px;">
			<div>
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
					<button class="info-tab__direction-button"
						@click="getDirection">
					</button>
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
		</div>
	</div>
</template>

<script>
import * as moment from 'moment'
import firebase from '../firebaseConfig'
import Vue from 'vue'
import Vuebar from 'vuebar'

Vue.use(Vuebar)

export default {
		name: 'infoWindow',
		beforeMount() {
			if (this.$store.state.user) {
				this.$bindAsObject('userReview', firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.location))
			}
			if (this.$route.query.location) {
				this.$bindAsObject('locationData', firebase.database().ref('locations').child(this.$route.query.location))
			}
		},
		data() {
			return {
				start: false,
				active: false,
				end: false,
				locationReviews: [],
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
				let r = this.locationReviews.sort((a, b) => {
					return b.submitTime - a.submitTime
				})

				return r.slice(0, 2)
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
			getDirection() {
				this.$emit('get-direction', this.locationData.position)
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
				this.$router.push({ query: '' })
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

/* vuebar styles */
@mixin gray($o) {
	background-color: rgba(0, 178, 124, $o)
}

.wrapper {
	position: absolute !important;
	height: 100vh;
	z-index: 4;
	@media (max-width : 429px) {
		width: 100%;
	}
}

.el1 {
	position: absolute !important;
	height: 100vh;
	z-index: 4;
	@media (max-width : 429px) {
		width: 100%;
	}
}
/**/

/* List Transition */
.list-fade-enter-active, .list-fade-leave-active {
	transition: all 0.3s;
}

.list-fade-enter, .list-fade-leave-to {
	opacity: 0;
	transform: translateY(50px);
}

.list-fade-enter-to, .list-fade-leave {
	opacity: 1;
}

/**/

.info-tab {
	background-color: white;
	position: relative;
	bottom: 0;
	width: 430px;
	z-index: 4;
	@media (max-width : 429px) {
		width: 100%;
	}
	&__head {
		position: relative;
		width: 100%;
		height: 400px;
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
			background-color: black;
			width: 100%;
			height: 300px;
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
	&__direction-button{
		background-color: white;
		border: none;
		border-radius: 50%;
		position: absolute;
		bottom: 50px;
		right: 15px;
		transform: translate(0, 50%);
		width: 50px;
		height: 50px;
		&:focus {
			outline-style: none;
		}
		&::before {
			background: url(../assets/compass.svg);
			background-size: 30px;
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-45%,-45%);
			width: 30px;
			height: 30px;
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
		&:focus {
			outline-style: none;
		}
		&--bottom {
			display: block;
			@include font-default(#00b27c, 15px);
			width: 100%;
			height: 40px;
		}
	}
}
</style>