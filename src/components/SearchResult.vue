<template>
	<div class="search-result">
		<div class="search-result__ribbon"></div>
		<template v-if="resultByName[0] || resultByAddress[0] || resultByCategory[0]">
			<div v-bar="{ el1Class: 'el1' }">
				<div>
					<div>
						<div class="search-result__heading">Search results for "{{ trimmedKey }}"</div>
						<div v-if="resultByName[0]"
							class="search-result__list-container">
							<div v-for="(result, index) in resultByName" :key="index"
								class="search-result__list">
								<div class="search-result__img-container"></div>
								<div class="search-result__details">
									<div class="search-result__name"
										@click="openLocation(result['.key'])">{{ result.name }}</div>
									<div class="search-result__category"
										@click="openCategory(result.category.key)">{{ result.category.name }}</div>
									<div class="search-result__address">{{ result.address }}</div>
								</div>
							</div>
						</div>
						<div v-if="resultByAddress[0]"
							class="search-result__list-container">
							<div class="search-result__heading">Addresses "{{ trimmedKey }}"</div>
							<div v-for="(result, index) in resultByAddress" :key="index"
								class="search-result__list">
								<div class="search-result__img-container"></div>
								<div class="search-result__details">
									<div class="search-result__name"
										@click="openLocation(result['.key'])">{{ result.name }}</div>
									<div class="search-result__category"
										@click="openCategory(result.category.key)">{{ result.category.name }}</div>
									<div class="search-result__address">{{ result.address }}</div>
								</div>
							</div>
						</div>
						<div v-if="resultByCategory[0]"
							class="search-result__list-container">
							<div class="search-result__heading">Categories "{{ trimmedKey }}"</div>
							<div v-for="(result, index) in resultByCategory" :key="index"
								class="search-result__list">
								<div class="search-result__img-container"></div>
								<div class="search-result__details">
									<div class="search-result__name"
										@click="openCategory(result['.key'])">{{ result.name }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			Not found :(
		</template>
	</div>
</template>

<script>
import firebase from '../firebaseConfig'

export default {
	name: 'SearchResult',
	data() {
		return {
			locations: [],
		}
	},
	firebase() {
		return {
			locations: {
				source: firebase.database().ref('locations')
			},
			categories: {
				source: firebase.database().ref('categories')
			}
		}
	},
	computed: {
		trimmedKey() {
			return this.$store.state.keyword.substr(0, 10)
		},
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
			return this.categories.filter((res) => {
				let keyword = this.$store.state.keyword.toLowerCase()
				return res.name.toLowerCase().includes(keyword)
			})
		}
	},
	methods: {
		openLocation(k) {
			this.$router.push({ query: { location: k } })
		},
		openCategory(k) {
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

.search-result {
	background-color: white;
	margin-left: 0;
	position: absolute;
	top: 0;
	left: 0;
	width: 430px;
	min-height: 100vh;
	z-index: 4;
	&__ribbon {
		width: 100%;
		height: 50px;
	}
	&__heading {
		box-sizing: border-box;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		@include font-default(black, 20px)
		width: 100%;
		padding: 5px 0;
	}
	&__list-container {
		box-sizing: border-box;
		width: 100%;
	}
	&__list {
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