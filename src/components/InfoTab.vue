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
			<div v-else>
				<button @click="openReviewForm">Add Review</button>
			</div>
			<div>
				uwu. //edit review here
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
	export default {
		name: 'infoTab',
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
				return this.locationReviews[this.$store.state.user.uid] ? true : false
			}
		},
		methods: {
			closeInfoTab() {
				this.$emit('close-info-tab')
			},
			openReviewForm() {
				this.$emit('open-review-form')
			},
			openLoginForm() {
				this.$emit('open-login-form')
			},
			submitTime(time) {
				return new Date(time)
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