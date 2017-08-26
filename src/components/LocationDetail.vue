<template>
	<div class="wrapper">
		<div v-bar="{el1Class: 'el1', el2Class: 'location-detail'}">
			<div>
				<div class="location-detail__head">
					<div class="location-detail__section">
						<div class="location-detail__title">
							{{ locationData.name }}
						</div>
						<button class="location-detail__flat-button location-detail__flat-button--close"
							@click="close">
						</button>
					</div>
					<div class="location-detail__image">
						This is a placeholder image for location {{ this.$route.query.key }}
					</div>
					<div class="location-detail__section location-detail__section--bottom">
						<div class="location-detail__title">
							{{ locationData.address }}
						</div>
					</div>
					<div class="location-detail__fab-container">
						<button class="location-detail__fab
							location-detail__fab--direction"
							@click="getDirection">
						</button>
						<button class="location-detail__fab
							location-detail__fab--share"
							@click="openShareForm">
						</button>
						<button v-if="isLoggedIn"
							class="location-detail__fab location-detail__fab--bookmark"
							:class="currentUserBookmarked ? 'location-detail__fab--bookmark--true' : 'location-detail__fab--bookmark--false'"
							@click="toggleBookmark">
						</button>
					</div>
				</div>
				<div class="location-detail__reviews">
					<div v-if="!isLoggedIn"
						class="location-detail__reviews__section">
						<button class="location-detail__flat-button location-detail__flat-button--login"
							@click="openLoginForm">Login</button>
					</div>
					<div v-if="isLoggedIn && !currentUserReviewed"
						class="location-detail__reviews__section">
						<button class="location-detail__flat-button location-detail__flat-button--write"
							@click="openReviewForm">Add Review</button>
					</div>
					<div v-if="currentUserReviewed"
						class="location-detail__reviews__section">
						<div class="location-detail__reviews__user-review">{{ userReview.content }}</div>
						<button class="location-detail__flat-button location-detail__flat-button--edit"
							@click="openReviewForm">Edit</button>
						<button class="location-detail__flat-button location-detail__flat-button--delete"
							@click="deleteReview">Delete</button>
					</div>
				</div>
				<div class="location-detail__review-item-wrapper">
					<div class="location-detail__review-item-heading"></div>
					<div v-for="(review, index) in orderedReviews" :key="index"
						class="location-detail__review-item">
						<span class="location-detail__review-item__user">{{ review.submittedBy }}</span>
						<span class="location-detail__review-item__content">{{ review.content }}</span>
						<span class="location-detail__review-item__time">{{ submitTime(review.submitTime) }}</span>
					</div>
				</div>
				<button class="location-detail__flat-button location-detail__flat-button--more-reviews"
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
		name: 'locationDetail',
		beforeMount() {
			if (this.$store.state.user) {
				this.$bindAsObject('userReview', firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.location))
				this.$bindAsObject('userBookmark', firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks').child(this.$route.query.location))

				/**/
				this.$firebaseRefs.userReview.once('value', (snapshot) => {
					if (snapshot.hasChild('content')) {
						this.currentUserReviewed = true
					}
				})
				this.$firebaseRefs.userBookmark.once('value', (snapshot) => {
					if (snapshot.hasChild('b')) {
						this.currentUserBookmarked = true
					}
				})
			}
			if (this.$route.query.location) {
				this.$bindAsObject('locationData', firebase.database().ref('locations').child(this.$route.query.location))
			}
				
		},
		data() {
			return {
				locationReviews: [],
				currentUserReviewed: false,
				currentUserBookmarked: false,
				userBookmark: [],
				userReview: [],
			}
		},
		firebase() {
			return {
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
		},
		watch: {
			userReview(n, o) {
				if (n.content) {
					this.currentUserReviewed = true
				} else {
					this.currentUserReviewed = false
				}
			},
			userBookmark(n, o) {
				if (n.name) {
					this.currentUserBookmarked = true
				} else {
					this.currentUserBookmarked = false
				}
			},
		},
		methods: {
			submitTime(time) {
				return moment(time).calendar()
			},
			toggleBookmark() {
				firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks').once('value', (snapshot) => {
						if (snapshot.hasChild(this.$route.query.location)) {
							firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks').child(this.$route.query.location).remove()
						} else {
							firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks').child(this.$route.query.location).set({
								name: this.locationData.name,
								category: this.locationData.category
							})
						}
					})
			},
			getDirection() {
				this.$emit('get-direction', this.locationData.position)
			},
			openShareForm() {
				this.$store.commit('openForm', 'socialShareForm')
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
				this.$store.commit('openReviewList')
			},
			close() {
				if (this.$route.query.category) {
					let c = this.$route.query.category
					this.$router.push({ query: { category: c } })
				} else {
					this.$router.push('')
				}
			}
		}
}
</script>

<style lang="scss" scoped>
@mixin box-shadow {
	box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
}
@mixin font-default($color, $size, $weight : 100) {
	color: $color;
	font-family: Roboto, Helvetica;
	font-size: $size;
	font-weight: $weight;
}
@mixin center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
@mixin fab-icon {
	background-size: 27px;
	content: '';
	width: 27px;
	height: 27px;
}
/****/

/* vuebar styles */
.wrapper {
	position: absolute !important;
	width: 430px;
	height: 100vh;
	z-index: 5;
	@media (max-width : 429px) {
		width: 100%;
	}
}

.el1 {
	position: absolute !important;
	width: 430px;
	height: 100vh;
	@media (max-width : 429px) {
		width: 100%;
	}
}
/**/

.location-detail {
	background-color: white;
	position: relative;
	bottom: 0;
	width: 430px;
	@media (max-width : 429px) {
		width: 100%;
	}
	&__head {
		position: relative;
		width: 100%;
		height: 400px;
	}
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
		@include font-default(white, 17px, 400);
		position: absolute;
		top: 15px;
		left: 5px;
	}
	&__fab-container {
		position: absolute;
		right: 15px;
		bottom: 50px;
		transform: translateY(50%);
		height: 50px;

	}
	&__fab{
		background-color: white;
		border: none;
		border-radius: 50%;
		@include box-shadow;
		position: relative;
		width: 50px;
		height: 50px;
		&:focus {
			outline-style: none;
		}
		&--bookmark {
			&--false {
				&::before {
					background: url('../assets/bookmark-outline.svg');
					@include center;
					@include fab-icon;
				}	
			}
			&--true {
				&::before {
					background: url('../assets/bookmark.svg');
					@include center;
					@include fab-icon;
				}	
			}
			
		}
		&--share {
			&::before {
				background: url('../assets/share.svg');
				@include center;
				@include fab-icon;
			}
		}
		&--direction {
			&::before {
				background: url(../assets/compass.svg);
				@include center;
				@include fab-icon;
			}
		}
	}
	&__reviews {
		position: relative;
		width: 100%;
		&__section {
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			position: relative;
			width: 100%;
			height: 150px;
			&::before {
				content: 'Your Review';
				@include font-default(black, 17px, 400);
				position: absolute;
				top: 5%;
				left: 50%;
				transform: translate(-50%, 50%);
			}
		}
		&__user-review {
			@include font-default(black, 15px)
			position: absolute;
			top: 25%;
			left: 50%;
			transform: translate(-50%, 0);
			width: 300px;
			text-align: left;
			word-wrap: break-word;
		}
	}
	&__flat-button {
		background-color: inherit;
		border: none;
		box-sizing: border-box;
		@include font-default(#00b27c, 17px, 400);
		padding: 5px 7px;
		&:focus {
			outline-style: none;
		}
		&--more-reviews{
			display: block;
			@include font-default(#00b27c, 15px, 400);
			width: 100%;
			height: 40px;
		}
		&--close {
			position: absolute;
			top: 50%;
			right: 20px;
			transform: translate(0, -50%);
			&::before {
				background: url(../assets/close-button-white.svg);
				background-size: 20px;
				content: '';
				@include center;
				width: 20px;
				height: 20px;
			}
		}
		&--write {
			position: absolute;
			top: 90%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		&--login {
			position: absolute;
			top: 90%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		&--edit {
			position: absolute;
			top: 90%;
			left: 35%;
			transform: translate(-50%,- 50%);
		}
		&--delete {
			position: absolute;
			top: 90%;
			left: 65%;
			transform: translate(-50%, -50%);
		}
	}
	&__review-item-wrapper {
		width: 100%;
	}
	&__review-item-heading {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		font-weight: bold;
		position: relative;
		width: 100%;
		height: 35px;
		&::before {
			content: 'Reviews';
			@include font-default(black, 20px, 400);
			position: absolute;
			top: 50%;
			left: 10px;
			transform: translateY(-50%);
		}
	}
	&__review-item {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		position: relative;
		width: 100%;
		height: 120px;
		&__user {
			@include font-default(black, 15px, 400);
			position: absolute;
			top: 5px;
			left: 10px;
		}
		&__content {
			@include font-default(black, 15px);
			position: absolute;
			top: 22px;
			left: 10px;
			width: 300px;
			word-wrap: break-word;
		}
		&__time {
			@include font-default(#00b27c, 9px);
			position: absolute;
			right: 10px;
			bottom: 5px;
		}
	}
}
</style>