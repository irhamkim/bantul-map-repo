<template>
	<div class="map">
		<floating-menu
			@search-location="searchLocation(payload)"
			@open-login-form="openLoginForm"
			@open-register-form="openRegisterForm">
		</floating-menu>
		<info-tab v-if="infoTabOpen"
			@close-info-tab="closeInfoTab"
			@open-login-form="openLoginForm"
			@open-review-form="openReviewForm">
		</info-tab>
		<login-form v-if="loginFormOpen"
			@close-login-form="closeLoginForm">
		</login-form>
		<review-form v-if="reviewFormOpen"
			@close-review-form="closeReviewForm">
		</review-form>
		<div v-if="popUpMessageOpen" class="map__popup-message">
			<template v-if="!errorMessage && !isLoading">
				<span class="map__popup-message__head">
					Allow us to use geolocation to determine your current location?
					Geolocation is needed to use most of our features.
				</span><br>
				<span class="map__popup-message__note">
					*We do not store any sensitive information.
				</span><br>
				<button @click="denyGeolocation" class="map__popup-message__button map__popup-message__button--left">Cancel</button>
				<button @click="allowGeolocation" class="map__popup-message__button map__popup-message__button--right">OK</button>
			</template>
			<template v-if="isLoading">
				Loading...
			</template>
			<template v-if="errorMessage">
				<span class="map__popup-message__head">
					{{ errorMessage }}
				</span>
				<button @click="denyGeolocation" class="map__popup-message__button map__popup-message__button--left">Cancel</button>
				<button @click="allowGeolocation" class="map__popup-message__button map__popup-message__button--right">Retry</button>
			</template>
		</div>
		<button class="map__circle-button"
			@click="panToUser">get position
		</button>
		<gmap-map ref="locationMap" :center="initialCenter" :zoom="15" 
			:options="options" :style="styles">
			<gmap-marker v-if="currentPosition" :position="currentPosition"
				@click="panTo(currentPosition)"></gmap-marker>
			<gmap-marker v-for="(location, index) in locations" :location="location" :key="index"
				:position="location.position"
				@click="openInfoTab(location['.key']), panTo(location.position)"></gmap-marker>
		</gmap-map>
	</div>
</template>

<script>
import FloatingMenu from './FloatingMenu'
import InfoTab from './InfoTab'
import LoginForm from './LoginForm'
import ReviewForm from './ReviewForm'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import firebase from '../firebaseApp'

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
				}
			})
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.$store.commit('setUserState', user)
			}
		})
	},
	data() {
		return {
			styles: {
				'width': '100%',
				'height': '100%',
				'z-index': 0
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
			infoTabOpen: false,
			reviewFormOpen: false,
			loginFormOpen: false
		}
	},
	firebase() {
		return {
			locations: firebase.database().ref('locations')
		}
	},
	components: {
		FloatingMenu,
		InfoTab,
		LoginForm,
		ReviewForm
	},
	methods: {
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
						case '1':
						this.errorMessage = 'Failed to get current position. Please enable geolocation or location service';
						break;

						case '2':
						this.errorMessage = 'Failed to get current position due to internal error. Please try again in a few moment';
						break;

						case '3':
						this.errorMessage = 'Failed to get current position due to connection timed out. Please try again in a few moment';
						break;
						
						default:
						this.errorMessage = 'Unknown error :(';
					}
				}, settings)
			}
		},
		denyGeolocation() {
			this.popUpMessageOpen = false
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
		openInfoTab(key) {
			this.infoTabOpen = true
			this.$router.push({ query: { location: key } })
		},
		closeInfoTab() {
			this.errorMessage = null
			this.infoTabOpen = false
			this.$router.push({ query: '' })
		},
		openReviewForm() {
			this.reviewFormOpen = true
		},
		closeReviewForm() {
			this.reviewFormOpen = false
		},
		searchLocation(payload) {},
		openLoginForm() {
			this.loginFormOpen = true
		},
		closeLoginForm() {
			this.loginFormOpen = false
		},
		openRegisterForm() {
			this.reviewFormOpen = true
		}
	},
	watch: {
		'$route' (to, from) {
			if (to.query.location) {
				
			} else {
				
			}
		}
	}
}
</script>

<style lang="scss">
.map {
	display: flex;
	width: 100%;
	height: 100%;
	position: absolute;
	&__popup-message {
		background-color: white;
		display: inline-block;
		padding: 15px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-right: -50%;
		transform: translate(-50%, -50%);
		width: 300px;
		height: 210px;
		z-index: 1;
		&__head {
			color: blue;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			font-weight: 500;
		}
		&__note {
			font-family: Roboto, Helvetica;
			font-size: 9px;
		}
		&__button {
			background-color: white;
			border: none;
			color: blue;
			font-family: Roboto, Helvetica;
			font-size: 17px;
			font-weight: 500;
			bottom: 15px;
			&--left {
				position: absolute;
				right: 70px;
			}
			&--right {
				position: absolute;
				right: 15px
			}
		}
	}
	&__circle-button {
		background-color: white;
		border: none;
		border-radius: 50%;
		position: absolute;
		right: 15px;
		bottom: 15px;
		width: 50px;
		height: 50px;
		z-index: 1;
	}
}
</style>