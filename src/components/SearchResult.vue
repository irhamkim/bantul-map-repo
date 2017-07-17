<template>
	<div class="search-result">
		<div>
			<li v-for="(result, index) in resultByName" :key="index">
				{{ result.name }}
			</li>
		</div>
		<div>
			<li v-for="(result, index) in resultByAddress" :key="index">
				{{ result.name }}
			</li>
		</div>
		<div>
			<li v-for="(result, index) in resultByCategory" :key="index">
				{{ result.name }}
			</li>
		</div>
	</div>
</template>

<script>
import firebase from '../firebaseApp'
	export default {
		name: 'SearchResult',
		data() {
			return {
				locations: []
			}
		},
		firebase() {
			return {
				locations: {
					source: firebase.database().ref('locations')
				}
			}
		},
		computed: {
			resultByName() {
				return this.locations.filter((res) => {
					let keyword = this.$store.state.keyword.toLowerCase()
					return res.name.toLowerCase().includes(keyword)
				})
			},
			resultByAddress() {
				return this.locations.filter((res) => {
					let keyword = this.$store.state.keyword.toLowerCase()
					return res.address.toLowerCase().includes(keyword)
				})
			},
			resultByCategory() {
				return this.locations.filter((res) => {
					let keyword = this.$store.state.keyword.toLowerCase()
					return res.category.toLowerCase().includes(keyword)
				})
			}
		},
		methods: {}
	}
</script>

<style>
	.search-result {
		background-color: white;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 400px;
		height: 300px;
		z-index: 2;
	}
</style>