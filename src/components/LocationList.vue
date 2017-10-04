<template>
	<div class="wrapper">
		<div clas="location-list">
			<div class="location-list__header">
			</div>
			<div v-bar="{ el1Class: 'el1', el2Class: 'location-list__item-wrapper' }">
				<div>
					<div>
						<h2 class="location-list__title">Locations</h2>
						<div v-for="(location, index) in locations" :key="index"
							class="location-list__item">
							<div class="location-list__img-container">
								<img src="" :alt="location['.key']">
							</div>
							<div class="location-list__details">
								<div class="location-list__name"
									@click="openLocationDetail(location['.key'])">{{ location.name }}</div>
								<div class="location-list__category"
									@click="openLocationByCategory(location.category.key)">{{ location.category.name }}</div>
								<div class="location-list__address">{{ location.address }}</div>
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
	name: 'locationList',
	firebase() {
		return {
			locations: {
				source: firebase.database().ref('locations')
			}
		}
	},
	methods: {
		closeWindow() {
			this.$store.commit('closeWindow')
		},
		openLocationDetail(k) {
			this.$router.push({ query: { location: k } })
		},
		openLocationByCategory(k) {
			this.$router.push({ query: { category: k } })
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

.location-list {
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
	&__category {
		cursor: pointer;
		@include font-default(#00b27c, 15px 100);
	}
	&__address {
		@include font-default(black, 15px, 100);
	}

}	
</style>