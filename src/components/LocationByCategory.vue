<template>
	<div class="wrapper">
		<div clas="locationbc-list">
			<div class="locationbc-list__header">
				<button class="locationbc-list__flat-button locationbc-list__flat-button--close"
				@click="closeWindow"></button>
			</div>
			<div v-bar="{ el1Class: 'el1', el2Class: 'locationbc-list__item-wrapper' }">
				<div>
					<div>
						<div v-for="(location, index) in locations" :key="index"
							class="locationbc-list__item">
							<div class="locationbc-list__img-container">
								<img src="" :alt="location['.key']">
							</div>
							<div class="locationbc-list__details">
								<div class="locationbc-list__name"
									@click="openInfoWindow(location['.key'])">
									{{ location.name }}
								</div>
								<div class="locationbc-list__address">{{ location.address }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import firebase from '../firebaseConfig'
import Vuebar from 'vuebar'

Vue.use(Vuebar)

export default {
	name: 'locationByCategoryList',
	firebase() {
		return {
			locations: {
				source: firebase.database().ref('categories').child(this.$route.query.key).child('locations')
			}
		}
	},
	methods: {
		closeWindow() {
			this.$router.go(-1)
		},
		openInfoWindow(k) {
			this.$router.push({ query: { window: 'infoWindow', key: k } })
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

.locationbc-list {
	background-color: white;
	position: relative;
	width: 430px;
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
			content: 'Locations';
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
				background: url(../assets/cancel-black.svg);
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
	&__address {
		@include font-default(black, 15px, 100);
	}

}	
</style>