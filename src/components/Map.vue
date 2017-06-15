<template>
	<div id="map">
		<div class="map__modal">
		</div>
		<gmap-map ref="locationMap" :center="destination" :zoom="15" style="width: 100%; height: 100%; z-index:0">
			<gmap-marker v-if="coords" :position="coords"></gmap-marker>
			<gmap-marker v-if="destination" :position="destination"></gmap-marker>\
		</gmap-map>
	</div>
</template>

<script>
	import VueGoogleMaps fom 'vue2-google-maps'
	import Vue from 'vue'
	import firebase from '../firebaseApp'

	Vue.use(VueGoogleMaps, {
		load: {
			key: 'AIzaSyB_WhUHEz1vlPiBEC4-9Z2Xf6TvrJ2gZjI'
		}
	})

	export default {
		name: 'map',
		data() {

		},
		firebase() {
			return {
				locations: db.ref('locations')
			}
		}
	}
</script>

<style lang="scss">
	
</style>