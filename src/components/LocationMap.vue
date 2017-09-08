<template>
	<div class="map">
		<omnibox>
		</omnibox>
		<location-detail v-if="this.$store.state.locationDetailIsActive"
			@get-direction="getDirection">
		</location-detail>
		<search-result v-if="this.$store.state.searchResultIsActive">
		</search-result>
		<user-menu v-if="activeWindow('userMenu')">
		</user-menu>
		<omniform v-if="this.$store.state.activeForm"></omniform>
		<category-list v-if="activeWindow('categoryList')"></category-list>
		<bookmark-list v-if="activeWindow('bookmarkList')"></bookmark-list>
		<location-list v-if="activeWindow('locationList')">
		</location-list>
		<closest-location v-if="activeWindow('closestLocation')"></closest-location>
		<location-by-category v-if="locationByCategoryIsActive"></location-by-category>
		<review-list v-if="this.$store.state.reviewListIsActive">
		</review-list>
		<transition name="fade" mode="out-in">
			<div v-if="popUpMessageOpen" class="map__popup-message">
				<transition name="fade">
					<div v-if="!errorMessage && !isLoading">
						<span class="map__popup-message__head">
							Allow us to use geolocation to determine your current location?
							Geolocation is needed to use most of our features.
						</span><br>
						<span class="map__popup-message__note">
							*We do not store any sensitive information.
						</span><br>
						<button @click="denyGeolocation" class="map__popup-message__button map__popup-message__button--left">Cancel</button>
						<button @click="allowGeolocation" class="map__popup-message__button map__popup-message__button--right">OK</button>
					</div>
				</transition>
				<transition name="fade">
					<div v-if="isLoading && !errorMessage">
						<span class="map__popup-message__loading">Loading...</span>
					</div>
				</transition>
				<transition name="fade">
					<div v-if="errorMessage && !isLoading">
						<span class="map__popup-message__head">
							{{ errorMessage }}
						</span>
						<button @click="denyGeolocation" class="map__popup-message__button map__popup-message__button--left">Cancel</button>
						<button @click="allowGeolocation" class="map__popup-message__button map__popup-message__button--right">Retry</button>
					</div>
				</transition>
			</div>
		</transition>
		<button class="map__circle-button"
			:class="{ 'map__circle-button--position-fixed': currentPosition, 'map__circle-button--position-not-fix': !currentPosition }"
			@click="panToUser">
		</button>
		<gmap-map ref="locationMap" :center="initialCenter" :zoom="18" 
			:options="options" :style="styles">
			<gmap-marker v-if="currentPosition" :position="currentPosition"
				@click="panTo(currentPosition)"></gmap-marker>
			<gmap-marker v-for="(location, index) in locations" :location="location" :key="index"
				:position="location.position"
				@click="openLocationDetail(location['.key']), panTo(location.position)"></gmap-marker>
		</gmap-map>
	</div>
</template>

<script>
import Omnibox from './Omnibox'
import Omniform from './Omniform'
import SearchResult from './SearchResult'
import UserMenu from './UserMenu'
import CategoryList from './CategoryList'
import BookmarkList from './BookmarkList'
import LocationList from './LocationList'
import ClosestLocation from './ClosestLocation'
import LocationByCategory from './LocationByCategory'
import ReviewList from './ReviewList'
import LocationDetail from './LocationDetail'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import firebase from '../firebaseConfig'

Vue.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyB_WhUHEz1vlPiBEC4-9Z2Xf6TvrJ2gZjI'
	}
})

export default {
	name: 'map',
	beforeMount() {
		if (this.$route.query.location) {
			firebase.database().ref('locations').on('value', (snapshot) => {
				if (snapshot.hasChild(this.$route.query.location)) {
					let position = snapshot.child(this.$route.query.location).child('position').val()
					this.initialCenter = {
						lat: position.lat,
						lng: position.lng
					}
					this.$store.commit('openLocationDetail')
				}
			})

			firebase.database().ref('categories').on('value', (snapshot) => {
				if (snapshot.hasChild(this.$route.query.category)) {
					this.$store.commit('openWindow', 'locationByCategory')
				}
			})
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.$store.commit('setUserState', user)
				firebase.database().ref('users').on('value', (snapshot) => {
					if (!snapshot.hasChild(this.$store.state.user.uid)) {
						firebase.database().ref('users').child(this.$store.state.user.uid).set({
							i: 1
						})
					}
				})
			}
		})
	},
	data() {
		return {
			styles: {
				'width': '100%',
				'height': '100%',
				'z-index': '0',
			},
			options: {
				disableDefaultUI: true
			},
			locations: [],
			initialCenter: {
				lat: -7.824432,
				lng: 110.373243
			},
			popUpMessageOpen: true,
			currentPosition: null,
			isLoading: false,
			errorMessage: null,
		}
	},
	components: {
		Omnibox,
		Omniform: () => import('./Omniform'),
		LocationDetail: () => import('./LocationDetail'),
		SearchResult: () => import('./SearchResult'),
		UserMenu: () => import('./UserMenu'),
		CategoryList: () => import('./CategoryList'),
		BookmarkList: () => import('./BookmarkList'),
		LocationList: () => import('./LocationList'),
		ClosestLocation: () => import('./ClosestLocation'),
		LocationByCategory: () => import('./LocationByCategory'),
		ReviewList: () => import('./ReviewList'),
	},
	firebase() {
		return {
			locations: firebase.database().ref('locations')
		}
	},
	computed: {
		locationByCategoryIsActive() {
			return this.activeWindow('locationByCategory') && this.$route.query.category ? true : false
		},
	},
	watch: {
		'$route' (to, from) {
			if (to.query.location) {
				firebase.database().ref('locations').once('value', (snapshot) => {
					if (snapshot.hasChild(to.query.location)) {
						let position = snapshot.child(to.query.location).child('position').val()
						this.initialCenter = {
							lat: position.lat,
							lng: position.lng
						}
						this.$store.commit('openLocationDetail')
					}
				})

			}

			if (to.query.category) {
				firebase.database().ref('categories').once('value', (snapshot) => {
					if (snapshot.hasChild(to.query.category)) {
						this.$store.commit('openWindow', 'locationByCategory')		
					}
				})

			}

			if (from.query.location && !to.query.location){
				this.$store.commit('closeLocationDetail')
			}

			if (from.query.category && !to.query.category) {
				this.$store.commit('closeWindow')
			}
		}
	},
	methods: {
		activeWindow(s) {
			return this.$store.state.activeWindow === s ? true : false
		},
		allowGeolocation() {
			this.errorMessage = null
			this.isLoading = true
			let settings = {
				enableHighAccuracy: false,
				timeout: 17000
			}

			if (navigator.geolocation) {
				//watch position to let marker follow user's position
				navigator.geolocation.watchPosition((position) => {
					this.currentPosition = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					}
					this.popUpMessageOpen = false
				}, (error) => {
					this.isLoading = false;
					switch (error.code) {
						case 1:
						this.errorMessage = 'Failed to get current position.\nPlease enable geolocation or location service';
						break;

						case 2:
						this.errorMessage = 'Failed to get current position due to internal error.\nPlease try again in a few moment';
						break;

						case 3:
						this.errorMessage = 'Failed to get current position due to connection timed out.\nPlease try again in a few moment';
						break;
						
						default:
						this.errorMessage = 'Unknown error :(';
					}
				}, settings)
			}
		},
		denyGeolocation() {
			this.popUpMessageOpen = false
			this.errorMessage = null
		},
		panTo(position) {
			this.$refs.locationMap.panTo(position)
		},
		panToUser() {
			if (this.currentPosition) {
				this.$refs.locationMap.panTo(this.currentPosition)
			} else {
				this.popUpMessageOpen = true
			}
		},
		getDirection(payload) {
			if (this.currentPosition) {
				this.popUpMessageOpen = true
				this.isLoading = true
				this.$store.commit('closeLocationDetail')

				var directionsService = new google.maps.DirectionsService
				var directionsDisplay = new google.maps.DirectionsRenderer
				var renderOptions = {
					suppressMarkers: true
				};
				directionsDisplay.setMap(this.$refs.locationMap.$mapObject)
				directionsDisplay.setOptions(renderOptions)

				var that = this
				//google maps API's direction service
				function calculateAndDisplayRoute(directionsService, directionsDisplay, start, destination) {
					directionsService.route({
						origin: start,
						destination: destination,
						travelMode: 'DRIVING'
					}, (response, status) => {
						if (status === 'OK') {
							that.$router.push('')
							directionsDisplay.setDirections(response)
							that.popUpMessageOpen = false
						} else {
							that.errorMessage = 'Direction request failed.\n' + status
							that.isLoading = false
						}
					})
				}
				
				calculateAndDisplayRoute(directionsService, directionsDisplay, this.currentPosition, payload)
			} else {
				this.popUpMessageOpen = true
			}
			this.$store.commit('closeWindow')
			this.$router.push('')
		},
		openLocationDetail(key) {
			this.$router.push({ query: { location: key } })
		},
	}
}
</script>

<style lang="scss">
/* Mixins */
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
/**/

/* Transition */
.fade-enter-active, .fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}
.fade-enter-to, .fade-leave {
	opacity: 1;
}
/**/

.map {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	position: relative;
	&__popup-message {
		background-color: white;
		border-radius: 5px;
		box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		box-sizing: border-box;
		display: inline-block;
		padding: 15px;
		position: absolute;
		@include center();
		width: 300px;
		height: 210px;
		z-index: 99;
		&__head {
			@include font-default(black, 17px);
		}
		&__note {
			@include font-default(black, 9px);
		}
		&__button {
			background-color: white;
			border: none;
			@include font-default(#00b27c, 17px);
			bottom: 15px;
			&--left {
				position: absolute;
				right: 70px;
			}
			&--right {
				position: absolute;
				right: 15px
			}
			&:active, &:focus {
				outline-style: none;
			}
		}
		&__loading {
			@include font-default(black, 17px);
			@include center();
		}
	}
	&__modal {
		background-color: rgba(0, 0, 0, 0.7);
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 3;
	}
	&__circle-button {
		background-color: white;
		border: none;
		border-radius: 50%;
		@include box-shadow;
		@include font-default(black, 9px);
		position: absolute;
		right: 15px;
		bottom: 25px;
		width: 40px;
		height: 40px;
		z-index: 1;
		&:active, &:focus {
			outline-style: none;
		}
		&--position-fixed {
			&::before {
				background: url(../assets/gps-fixed-indicator.svg);
				background-size: 30px;
				content: '';
				@include center();
				width: 30px;
				height: 30px;
			}
		}
		&--position-not-fix {
			&::before {
				background: url(../assets/gps-location-symbol.svg);
				background-size: 30px;
				content: '';
				@include center();
				width: 30px;
				height: 30px;	
			}
		}
		
	}
}
</style>