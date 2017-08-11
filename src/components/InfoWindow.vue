<template>
	<div class="wrapper">
		<div v-bar="{el1Class: 'el1', el2Class: 'info-tab'}">
			<div>
				<div class="info-tab__head">
					<div class="info-tab__section">
						<div class="info-tab__title">
							{{ locationData.name }}
						</div>
						<button class="info-tab__flat-button info-tab__flat-button--close"
							@click="closeInfoWindow">
						</button>
					</div>
					<div class="info-tab__image">
						This is a placeholder image for location {{ this.$route.query.key }}
					</div>
					<div class="info-tab__section info-tab__section--bottom">
						<div class="info-tab__title">
							{{ locationData.address }}
						</div>
					</div>
					<button v-if="isLoggedIn"
						class="info-tab__fab info-tab__fab--bookmark"
						:class="currentUserBookmarked ? 'info-tab__fab--bookmark--true' : 'info-tab__fab--bookmark--false'"
						@click="toggleBookmark">
					</button>
					<button class="info-tab__fab info-tab__fab--direction"
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
				</div>
				<div class="info-tab__review-item-wrapper">
					<div class="info-tab__review-item-heading"></div>
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
				this.$bindAsObject('userReview', firebase.database().ref('users').child(this.$store.state.user.uid).child('reviews').child(this.$route.query.key))
				this.$bindAsObject('userBookmark', firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks').child(this.$route.query.key))

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
			if (this.$route.query.key) {
				this.$bindAsObject('locationData', firebase.database().ref('locations').child(this.$route.query.key))
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
					source: firebase.database().ref('locations').child(this.$route.query.key).child('reviews')
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
			/**currentUserReviewed() {
				if (this.$store.state.user) {
					let val
					this.$firebaseRefs.userReview.once('value', (snapshot) => {
						if (snapshot.hasChild(this.$route.query.key)) {
							val = true
						} else {
							val = false
						}
					})
					return val
				} else {
					return false
				}
			},
			currentUserBookmarked() {
				if (this.$store.state.user) {
					let val
					firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks').once('value', (snapshot) => {
						if (snapshot.hasChild(this.$route.query.key)) {
							val = true
						} else {
							val = false
						}
					})
					return val
				} else {
					return false
				}
			},**/
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
				if (n.b) {
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
						if (snapshot.hasChild(this.$route.query.key)) {
							firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks').child(this.$route.query.key).remove()
						} else {
							firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks').child(this.$route.query.key).set({
								b: true
							})
						}
					})
			},
			getDirection() {
				this.$emit('get-direction', this.locationData.position)
			},
			openReviewForm() {
				this.$router.push({ query: { form: 'reviewForm', key: this.$route.query.key } })
			},
			openLoginForm() {
				this.$router.push({ query: { form: 'loginForm' } })
			},
			deleteReview() {
				this.$firebaseRefs.userReview.remove()
				this.$firebaseRefs.locationReviews.child(this.$store.state.user.uid).remove()
			},
			openReviewWindow() {
				this.$router.push({ query: { window: 'reviewList', key: this.$route.query.key } })
			},
			closeInfoWindow() {
				this.$router.go(-1)
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

/* vuebar styles */
.wrapper {
	position: absolute !important;
	width: 430px;
	height: 100vh;
	z-index: 4;
	@media (max-width : 429px) {
		width: 100%;
	}
}

.el1 {
	position: absolute !important;
	width: 430px;
	height: 100vh;
	z-index: 4;
	@media (max-width : 429px) {
		width: 100%;
	}
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
		&__flat-button {
			background-color: #00b27c;
			border: none;
			color: white;
			font-size: 22px;
			&:focus {
				outline-style: none;
			}
			&--bottom {
				background-color: white;
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
	&__fab{
		background-color: white;
		border: none;
		border-radius: 50%;
		@include box-shadow;
		position: absolute;
		width: 50px;
		height: 50px;
		&:focus {
			outline-style: none;
		}
		&--bookmark {
			bottom: 50px;
			right: 70px;
			transform: translate(0, 50%);
			&--false {
				&::before {
					background: url('../assets/bookmark-outline.svg');
					background-size: 25px;
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
					width: 25px;
					height: 25px;
				}	
			}
			&--true {
				&::before {
					background: url('../assets/bookmark-ribbon.svg');
					background-size: 25px;
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
					width: 25px;
					height: 25px;
				}	
			}
			
		}
		&--direction {
			bottom: 50px;
			right: 15px;
			transform: translate(0, 50%);
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
	}
	&__reviews {
		position: relative;
		width: 100%;
		&__section {
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			position: relative;
			width: 100%;
			height: 250px;
		}
		&__user-review {
			@include font-default(black, 15px)
			position: absolute;
			top: 15%;
			left: 50%;
			transform: translate(-50%, 0);
			width: 300px;
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