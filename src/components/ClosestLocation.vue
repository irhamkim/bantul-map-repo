<template>
<div class="wrapper">
	<div class="closest-location">
		<div class="closest-location__header">
			<button class="closest-location__flat-button closest-location__flat-button--close"
			@click="closeWindow"></button>
		</div>
		<div v-bar="{ el1Class: 'el1', el2Class: 'closest-location__item-wrapper' }">
			<div>
				<div>
					<h2 class="closest-location__title">Closest Location</h2>
					<div :key="-1" class="closest-location__item">
						<div class="closest-location__img-container">
							<img src="" alt="">
						</div>
						<div class="closest-location__details">
							<div class="closest-location__name"
								@click="openClosestLocationByCategory('*')">
								All categories 
							</div>
						</div>
					</div>
					<div v-for="(category, index) in categories" :key="index"
						class="closest-location__item">
						<div class="closest-location__img-container">
							<img src="" :alt="category['.key']">
						</div>
						<div class="closest-location__details">
							<div class="closest-location__name"
								@click="openClosestLocationByCategory(category['.key'])">
								{{ category.name }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import firebase from '../firebaseConfig'

export default {
	name: 'closest-Location',
	firebase() {
		return {
			categories: {
				source: firebase.database().ref('categories')
			}
		}
	},
	methods: {
		openClosestLocationByCategory(key) {
			this.$store.commit('openClosestLocationByCategory', key)
			this.$nextTick(()=> {
				this.$store.commit('openWindow', 'closestLocationByCategory')
			})
		},
		closeWindow() {
			this.$store.commit('closeWindow')
		}
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
	z-index: 3;
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

.closest-location {
	background-color: white;
	position: relative;
	width: 430px;
	height: 100%;
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
	}
	&__title {
		@include font-default(black, 18px, 400);
		position: relative;
		left: 5px;
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
	&__item {
		box-sizing: border-box;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		display: flex;
		position: relative;
		width: 100%;
		height: 160px;
	}
	&__img-container {
		flex: 1 0 40%;
		min-width: 40%;
	}
	&__img {

	}
	&__details {
		box-sizing: border-box;
		flex: 1 0 60%;
		padding: 5px;
	}
	&__name {
		cursor: pointer;
		@include font-default(#00b27c, 17px, 400);
	}

}
</style>