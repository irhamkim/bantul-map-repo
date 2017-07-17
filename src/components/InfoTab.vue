<template>
	<div class="info-tab">
		<div class="info-tab__head">
			{{ locationData.name }}
			<button @click="closeInfoTab">X</button><br>
		</div>
		<div class="info-tab__reviews-list">
			<div v-if="!isLoggedIn">
				<button @click="openLoginForm">Login</button>
			</div>
			<div v-if="isLoggedIn && !currentUserReviewed">
				<button @click="openReviewForm">Add Review</button>
			</div>
			<div v-if="currentUserReviewed">
				{{ userReview.content }}
				<button @click="openReviewForm">Edit</button>
				<button @click="deleteReview">Delete</button>
			</div>
			<li v-for="(review, index) in reviews" :key="index">
				<span>{{ review.submittedBy }}</span>
				<span>{{ review.content }}</span>
				<span v-text="submitTime(review.submitTime)"></span>
			</li>
		</div>
	</div>
</template>

<script>
import firebase from '../firebaseApp'
import * as moment from 'moment'

	export default {
		name: 'infoTab',
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
			reviews() {
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
			closeInfoTab() {
				this.$emit('close-info-tab')
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
.info-tab {
	background-color: white;
	margin-left: 0;
	position: absolute;
	left: 0;
	width: 300px;
	height: 100%;
	z-index: 1;
	&__head {
		background-color: blue;
		width: 100%;
		height: 41px;
	}
}
</style>