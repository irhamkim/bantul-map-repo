<template>
	<div class="wrapper">
		<div clas="category-list">
			<div class="category-list__header">
			</div>
			<div v-bar="{ el1Class: 'el1', el2Class: 'category-list__item-wrapper' }">
				<div>
					<div>
						<h2 class="category-list__title">Categories</h2>
						<div v-for="(category, index) in categories" :key="index"
							class="category-list__item">
							<div class="category-list__img-container">
								<img src="" :alt="category['.key']">
							</div>
							<div class="category-list__details">
								<div class="category-list__name"
									@click="openLocationByCategory(category['.key'])">
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
import Vue from 'vue'
import firebase from '../firebaseConfig'
import Vuebar from 'vuebar'

Vue.use(Vuebar)

export default {
	name: 'categoryList',
	firebase() {
		return {
			categories: {
				source: firebase.database().ref('categories')
			}
		}
	},
	methods: {
		closeWindow() {
			this.$store.commit('closeWindow')
		},
		openLocationByCategory(k) {
			this.$router.push({ query: { category: k } })
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

.category-list {
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
		&::before {
			content: 'Locations';
			@include font-default(black, 17px, 400);
			position: absolute;
			top: 50%;
			left: 10px;
			transform: translateY(-50%);
		}
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

}		
</style>