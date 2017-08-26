<template>
	<div class="omnibox">
		<div class="omnibox__search-input-wrapper">
			<input class="omnibox__search-input" type="text" placeholder="Search location"
				v-model="searchKeyword"
				@keyup.enter="searchLocation"
				@keyup.esc="closeSearchResult">
		</div>
		<button class="omnibox__flat-button omnibox__flat-button--search"
			@click="searchLocation">
		</button>
		<button v-if="!searchKeyword && !windowIsActive"
			class="omnibox__flat-button omnibox__flat-button--menu"
			@click="openUserMenu">
		</button>
		<button v-if="!searchKeyword && windowIsActive"
			class="omnibox__flat-button omnibox__flat-button--cancel"
			@click="closeWindow">
		</button>
		<button v-if="searchKeyword"
			class="omnibox__flat-button omnibox__flat-button--cancel"
			@click="closeSearchResult">
		</button>
	</div>
</template>

<script>

export default {
	name: 'omnibox',
	data() {
		return {
			searchKeyword: null,
		}
	},
	computed: {
		windowIsActive() {
			return this.$store.state.searchResultIsActive || this.$store.state.activeWindow ? true : false 
		},
		isLoggedIn() {
			return this.$store.state.user ? true : false
		},
	},
	methods: {
		searchLocation() {
			if (this.searchKeyword) {
				this.$store.commit('searchLocation', this.searchKeyword)
				this.$store.commit('openSearchResult')
			} else if (!this.searchKeyword && this.$store.state.activeWindow) {	

			} else {
				this.$store.commit('closeSearchResult')
			}
		},
		openUserMenu() {
			this.$store.commit('openWindow', 'userMenu')
		},
		closeSearchResult() {
			this.searchKeyword = null
			this.$store.commit('closeSearchResult')
		},
		closeWindow() {
			this.$store.commit('closeWindow')
		},
	}

}

</script>
	
<style lang="scss">
/** Mixins **/
@mixin font-default($color, $size, $weight : 100) {
	color: $color;
	font-family: Roboto, Helvetica;
	font-size: $size;
	font-weight: $weight;
}
/*****/
.omnibox {
	background-color: white;
	border-radius: 5px;
	box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
	box-sizing: border-box;
	display: flex;
	padding: 5px;
	position: absolute;
	top: 5px;
	left: 5px;
	width: 420px;
	height: 40px;
	z-index: 3;
	@media (max-width : 429px) {
		width: calc(100% - 10px);
	}
	&__search-input-wrapper {
		display: flex;
		flex: 1 1 auto;
		position: relative;
		min-width: 70%;
		height: 30px;
		@media (max-width : 429px) {
				
		}
	}
	&__search-input {
		border: none;
		box-sizing: border-box;
		@include font-default(#727272, 17px);
		width: 100%;
		padding-left: 5px;
		height: 30px;
		&:active, &:focus {
			outline-style: none;
		}
		@media (max-width : 429px) {
				
		}
	}
	&__button {
		background-color: #00b27c;
		border: none;
		box-sizing: border-box;
		color: white;
		flex: 1 1 15%;
		height: 30px;
		&:focus {
			outline-style: none;
		}
	}
	&__flat-button {
		box-sizing: border-box;
		background-color: white;
		border: none;
		color: rgba(0, 0, 0, 0.5);
		flex: 1 1 15%;
		position: relative;
		max-width: 15%;
		height: 30px;
		&:focus {
			outline-style: none;
		}
		&--search {
			&::before {
				background: url(../assets/magnifying-glass.svg);
				background-size: 20px 20px;
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 20px;
				height: 20px;
			}
			&::after {
				content: '';
				border-right: 2px solid #cccccc;
				position: absolute;
				top: 0;
				right: 0;
				height: 30px;
			}
		}
		&--menu {
			&::before {
				background: url(../assets/menu.svg);
				background-size: 20px 20px;
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 20px;
				height: 20px;
			}
		}
		&--cancel {
			&::before {
				background: url(../assets/close-button.svg);
				background-size: 20px 20px;
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 20px;
				height: 20px;
			}
		}
	}
}
</style>