<template>
	<div class="floating-menu">
		<div class="floating-menu__search-input-wrapper">
			<input class="floating-menu__search-input" type="text" placeholder="Search location"
				v-model="searchKeyword"
				@keyup.enter="searchLocation"
				@keyup.esc="closeSearchResult">
		</div>
		<button class="floating-menu__flat-button floating-menu__flat-button--search"
			@click="searchLocation"></button>
		<button v-if="windowOpen" class="floating-menu__flat-button floating-menu__flat-button--cancel"
			@click="closeWindow(), closeMenu()"></button>
		<button v-if="!windowOpen && !searchKeyword" class="floating-menu__flat-button floating-menu__flat-button--menu"
			@click="openMenu">
		</button>
		<button v-if="!windowOpen && searchKeyword" class="floating-menu__flat-button"
			@click="closeSearchResult">Cancel
		</button>
	</div>
</template>

<script>

export default {
	name: 'floatingMenu',
	data() {
		return {
			searchKeyword: null,
		}
	},
	computed: {
		isLoggedIn() {
			return this.$store.state.user ? true : false
		},
		windowOpen() {
			return this.$store.state.openWindow || this.$store.state.userMenuOpen ? true : false
		},
		infoWindowOpen() {
			return this.$store.state.infoWindowOpen ? true : false
		}
	},
	methods: {
		searchLocation() {
			if (this.searchKeyword) {
				this.$store.commit('searchLocation', this.searchKeyword)
				this.$store.commit('openWindow', 'searchResult')
			} else {
				this.$store.state.openWindow === 'infoWindow' ? '' : this.$store.commit('closeWindow')
			}
		},
		openLoginForm() {
			this.$store.commit('openForm', 'loginForm')
		},
		openMenu() {
			this.$store.commit('openUserMenu')
		},
		closeMenu() {
			this.$store.commit('closeUserMenu')
		},
		closeSearchResult() {
			this.searchKeyword = null
			this.$store.commit('closeWindow')
		},
		closeWindow() {
			this.$store.commit('closeWindow')
		},
	}

}

</script>
	
<style lang="scss">
.floating-menu {
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
	z-index: 4;
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
		font-family: Roboto, Helvetica;
		font-size: 17px;
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
		font-family: Roboto, Helvetica;
		font-size: 17px;
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
		font-family: Roboto, Helvetica;
		font-size: 17px;
		position: relative;
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
				background: url(../assets/cancel.svg);
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