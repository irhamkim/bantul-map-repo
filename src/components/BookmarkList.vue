<template>
	<div class="wrapper">
		<div clas="bookmark-list">
			<div class="bookmark-list__header">
			</div>
			<div v-bar="{ el1Class: 'el1', el2Class: 'bookmark-list__item-wrapper' }">
				<div>
					<div>
						<h2 class="bookmark-list__title">Bookmarks</h2>
						<template v-if="haveBookmarked">
							<div v-for="(location, index) in locations" :key="index"
								class="bookmark-list__item">
								<div class="bookmark-list__img-container">
									<img src="" :alt="location['.key']">
								</div>
								<div class="bookmark-list__details">
									<div class="bookmark-list__name"
										@click="openLocationDetail(location['.key'])">
										{{ location.name }}
									</div>
									<div class="bookmark-list__category"
										@click="openLocationByCategory(location.category.key)">{{ location.category.name }}</div>
									<div class="bookmark-list__address">{{ location.address }}</div>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="bookmark-list__msg">You haven't bookmarked any item yet.</div>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import firebase from '../firebaseConfig'
import Vue from 'vue'
import Vuebar from 'vuebar'

Vue.use(Vuebar)

export default {
	name: 'bookmarkList',
	firebase() {
		return {
			locations: firebase.database().ref('users').child(this.$store.state.user.uid).child('bookmarks')
		}
	},
	computed: {
		haveBookmarked() {
			return this.locations.length > 1 ? true : false 
			//Object.keys(this.locations[0]).length === 0 && this.locations[0].constructor === Object 
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

.bookmark-list {
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
	&__msg {
		@include center();
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
		@include font-default(#00b27c, 15px 100);
	}
	&__address {
		@include font-default(black, 15px, 100);
	}

}			
</style>