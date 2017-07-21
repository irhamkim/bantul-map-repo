<template>
	<div class="map">
		<floating-menu>
		</floating-menu>
		<info-window v-if="infoWindowOpen"
			@set-height="setHeight">
		</info-window>
		<search-result v-if="openWindow === 'searchResult'">
		</search-result>
		<login-form v-if="openForm === 'loginForm'">
		</login-form>
		<review-form v-if="openForm === 'reviewForm'">
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
				<span class="map__popup-message__loading">Loading...</span>
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
		<gmap-map ref="locationMap" :center="initialCenter" :zoom="18" 
			:options="options" :style="styles">
			<gmap-marker v-if="currentPosition" :position="currentPosition"
				@click="panTo(currentPosition)"></gmap-marker>
			<gmap-marker v-for="(location, index) in locations" :location="location" :key="index"
				:position="location.position"
				@click="openInfoWindow(location['.key']), panTo(location.position)"></gmap-marker>
		</gmap-map>
	</div>
</template>

<script>
import FloatingMenu from './FloatingMenu'
import InfoWindow from './InfoWindow'
import LoginForm from './LoginForm'
import ReviewForm from './ReviewForm'
import SearchResult from './SearchResult'
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
					this.$store.commit('openInfoWindow')
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
		}
	},
	computed: {
		infoWindowOpen() {
			return this.$store.state.infoWindowOpen
		},
		openWindow() {
			return this.$store.state.openWindow
		},
		openForm() {
			return this.$store.state.openForm
		}
	},
	firebase() {
		return {
			locations: firebase.database().ref('locations')
		}
	},
	components: {
		FloatingMenu,
		InfoWindow,
		LoginForm,
		ReviewForm,
		SearchResult
	},
	methods: {
		setHeight(h) {
			h ? this.styles.height = h +'px' : this.styles.height = '100%'
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
		openInfoWindow(key) {
			this.$router.push({ query: { location: key } })
			this.$store.commit('openInfoWindow')
		},
		closeInfoWindow() {
			this.$router.push({ query: '' })
			this.$store.commit('closeInfoWindow')
		},
	}
}
</script>

<style lang="scss">
@mixin box-shadow {
	box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
}
@mixin font-default($color, $size) {
	color: $color;
	font-family: Roboto, Helvetica;
	font-size: $size;
}

.map {
	display: flex;
	width: 100%;
	height: 100%;
	position: absolute;
	&__popup-message {
		background-color: white;
		border-radius: 5px;
		box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
		box-sizing: border-box;
		display: inline-block;
		padding: 15px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-right: -50%;
		transform: translate(-50%, -50%);
		width: 300px;
		height: 210px;
		z-index: 4;
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
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
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
		@include font-default(black, 9px);
		position: absolute;
		right: 15px;
		bottom: 15px;
		width: 50px;
		height: 50px;
		z-index: 1;
		&:active, &:focus {
			outline-style: none;
		}
	}
}
</style>