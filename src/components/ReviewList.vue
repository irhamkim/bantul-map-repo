<template>
	<div class="wrapper">
		<div clas="review-list">
			<div class="review-list__header">
				<button class="review-list__flat-button review-list__flat-button--close"
				@click="closeWindow"></button>
			</div>
			<div v-bar="{ el1Class: 'el1', el2Class: 'review-list__item-wrapper' }">
				<div>
					<div>
						<div v-for="(review, index) in orderedReviews" :key="index"
							class="review-list__item">
							<span class="review-list__user">{{ review.submittedBy }}</span>
							<span class="review-list__content">{{ review.content }}</span>
							<span class="review-list__time">{{ submitTime(review.submitTime) }}</span>
						</div>
					</div>
				</div>
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
	name: 'reviewList',
	firebase() {
		return {
			reviews: {
				source: firebase.database().ref('locations').child(this.$route.query.location).child('reviews')
			}
		}
	},
	computed: {
		orderedReviews() {
			let r = this.reviews.sort((a, b) => {
				return b.submitTime - a.submitTime
			})

			return r
		}
	},
	methods: {
		closeWindow() {
			this.$store.commit('closeReviewList')
		},
		submitTime(t) {
			return moment(t).calendar()
		},
	}

}
	
</script>

<style lang="scss" scoped>
/*** Mixins ***/
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
	background-color: white;
	position: absolute !important;
	top: 50px;
	width: 430px;
	height: calc(100vh - 50px);
	@media (max-width : 429px) {
		width: 100%;
	}
}
/****/

.review-list {
	background-color: white;
	position: relative;
	width: 430px;
	z-index: 6;
	@media (max-width: 429px) {
		border-radius: 0;
		box-shadow: none;
		width: 100%;
		min-height: 100%;
		top: 0;
		left: 0;
		transform: none;
	}
	&__header {
		background-color: white;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 50px;
		top: 0;
		z-index: 1;
		&::before {
			content: 'All Reviews';
			@include font-default(black, 17px, 400);
			position: absolute;
			top: 50%;
			left: 10px;
			transform: translateY(-50%);
		}
	}
	&__flat-button {
		background-color: white;
		border: none;
		&:focus {
			outline-style: none;
		}
		&--close {
			position: absolute;
			top: 50%;
			right: 20px;
			transform: translateY(-50%);
			width: 15px;
			height: 15px;
			&::before {
				background: url(../assets/close-button.svg);
				background-size: 15px;
				content: '';
				position: absolute;
				@include center;
				width: 15px;
				height: 15px;
			}
		}
	}
	&__item-wrapper {
		position: relative;
	}
	&__item {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		position: relative;
		width: 100%;
		height: 120px;
	}
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
</style>