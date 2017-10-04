<template>
<div class="wrapper">
	<div class="closest-location-by-category">
		<div class="closest-location-by-category__header">
		</div>
		<div v-if="isLoading"
			class="closest-location-by-category__loading">
			<div class="closest-location-by-category__loading-msg">{{ status }}</div>
		</div>
		<div v-else
			v-bar="{ el1Class: 'el1', el2Class: 'closest-location-by-category__item-wrapper' }">
			<div>
				<div>
					<h2 class="closest-location-by-category__title">{{ title }}</h2>
					<div v-for="(location, index) in sortedLocation" :key="index"
						class="closest-location-by-category__item">
						<div class="closest-location-by-category__img-container">
							<img src="" :alt="location['.key']">
						</div>
						<div class="closest-location-by-category__details">
							<div class="closest-location-by-category__name"
								@click="openClosestLocation(location['.key'])">{{ location.name }}
							</div>
							<div class="closest-location-by-category__category"
								@click="openLocationByCategory(location.category.key)">{{ location.category.name }}</div>
							<div class="closest-location-by-category__address">{{ location.address }}</div>
							<div class="closest-location-by-category__distance">{{ location.distanceText }}</div>
							<div class="closest-location-by-category__duration">{{ location.durationText }}</div>
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
	name: 'closestLocationByCategory',
	beforeMount() {
		if (this.$store.state.closestLocationCategory === '*') {
			this.$bindAsArray('locationByCategory', firebase.database().ref('locations'))
		} else {
			this.$bindAsArray('locationByCategory', firebase.database().ref('categories').child(this.$store.state.closestLocationCategory).child('locations'))
		}
		this.sortLocation()
	},
	props: ['currentPosition'],
	data() {
		return {
			status: 'Loading',
			isLoading: true,
			sortedLocation: [],
			errorMessage: ''
		}
	},
	computed: {
		title() {
			var c = this.$store.state.closestLocationCategory
			return c === '*' ? 'All Categories' : 'Closest ' + c + ' locations'
		}
	},
	methods: {
		sortLocation() {
            var arrDirections = this.locationByCategory;
            var service = new google.maps.DistanceMatrixService();
			
			var arrDestination = [];
		    for (var i = 0; i < arrDirections.length; i++) {
				var lat = arrDirections[i].position.lat
				var lng = arrDirections[i].position.lng

				var destination = new google.maps.LatLng(lat, lng)

				arrDestination.push(destination)
				console.log('push ' + i)
				console.log(arrDestination)
			}

			var startPos = new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng);
			service.getDistanceMatrix({
				origins: [startPos],
				destinations: arrDestination,
				travelMode: 'DRIVING'
			}, callback)

			var that = this
			function callback(response, status) {
				console.log(status);
				if (status == 'OK') {
				  var origins = response.originAddresses;
				  var destinations = response.destinationAddresses;

				  for (var i = 0; i < origins.length; i++) {
					var results = response.rows[i].elements;
					for (var j = 0; j < results.length; j++) {
					  var element = results[j];
					  var distance = element.distance.text;
					  var distanceVal = element.distance.value;
					  var duration = element.duration.text;
					  var durationVal = element.duration.value;
					  var from = origins[i];
					  var to = destinations[j];
					  arrDirections[j].distance = distanceVal;
					  arrDirections[j].duration = durationVal;
					  arrDirections[j].distanceText = distance;
					  arrDirections[j].durationText = duration;
					}
				  }
				  arrDirections.sort(function(a, b) {
					return a.duration - b.duration;
				  });
				  that.sortedLocation = arrDirections;
				  that.status = '';
				  that.isLoading = false;
				} else {
					that.status = status
				}
			}
			
		},
		openClosestLocation(key) {
			this.$router.push({ query: { location: key } })
		},
		openLocationByCategory(k) {
			this.$router.push({ query: { category: k } })
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
@mixin center() {
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

.closest-location-by-category {
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
	&__loading {
		@include center();
	}
	&__loading-msg {
		@include font-default(black, 17px, 400);
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
		@include font-default(#00b27c, 15px, 100);
	}
	&__address {
		@include font-default(black, 15px, 100);
	}

	&__distance {
		@include font-default(black, 15px, 100);
	}

	&__duration {
		@include font-default(black, 15px, 100);
	}

}	
</style>