<template>
	<div class="user-menu">
		<div class="user-menu__section">
			<div class="user-menu__header"></div>
			<div class="user-menu__profile"></div>
		</div>
		<button class="user-menu__button user-menu__button--locations"
			@click="openWindow('locationList')"></button>
		<button class="user-menu__button user-menu__button--categories"
			@click="openWindow('categoryList')"></button>
		<template v-if="!isLoggedIn">
			<button class="user-menu__button user-menu__button--login"
				@click="openLoginForm"></button>
		</template>
		<template v-else>
			<button class="user-menu__button user-menu__button--bookmarks"
				@click="openWindow('bookmarks')"></button>
			<button class="user-menu__button user-menu__button--logout"
				@click="logOutUser"></button>
		</template>
		<div class="user-menu__footer">Material Design Icons &copy; Google</div>
	</div>
</template>

<script>
import firebase from '../firebaseConfig'

export default {
	name: 'userMenu',
	computed: {
		isLoggedIn() {
			return this.$store.state.user ? true : false;
		},
	},
	methods: {
		closeUserMenu() {
			this.$store.commit('closeWindow')
		},
		openLoginForm() {
			this.$router.push({ query: { form: 'loginForm' } })
		},
		openWindow(n) {
			this.$router.push({ query: { window: n } })
		},
		logOutUser() {
			firebase.auth().signOut().then(() => {
				this.$store.commit('removeUserState')
			}).catch(() => {

			})
		},
	}

}
</script>

<style lang="scss">
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
@mixin button-icon {
	position: absolute;
	top: 50%;
	left: 20px;
	transform: translateY(-50%);
}
@mixin button-text {
	position: absolute;
	top: 50%;
	left: 70px;
	transform: translateY(-50%);
}
.user-menu {
	background-color: white;
	position: absolute;
	width: 430px;
	min-height: 100vh;
	z-index: 2;
	@media (max-width : 429px) {
		width: 100%;
	}
	&__header {
		background-color: #00b27c;
		position: relative;
		width: 100%;
		height: 50px;
	}
	&__button {
		background-color: inherit;
		border: none;
		position: relative;
		width: 100%;
		height: 50px;
		&:focus {
			outline-style: none;
		}
		&--locations {
			&::before {
				content: 'L';
				@include button-icon;
			}
			&::after {
				content: 'Locations';
				@include font-default(black, 15px);
				@include button-text;
			}
		}
		&--categories {
			&::before {
				content: 'C';
				@include button-icon;
			}
			&::after {
				content: 'Categories';
				@include font-default(black, 15px);
				@include button-text;
			}
		}
		&--login {
			&::before {
				content: 'L';
				@include button-icon;
			}
			&::after {
				content: 'Login';
				@include font-default(black, 15px);
				@include button-text;
			}
		}
		&--bookmarks {
			&::before {
				content: 'B';
				@include button-icon;
			}
			&::after {
				content: 'Bookmarks';
				@include font-default(black, 15px);
				@include button-text;
			}
		}
		&--logout {
			&::before {
				content: 'L';
				@include button-icon;
			}
			&::after {
				content: 'Log Out';
				@include font-default(black, 15px);
				@include button-text;
			}
		}
	}
	&__profile {
		background-color: #ccc;
		border-bottom: 1px solid #cccccc;
		box-sizing: border-box;
		width: 100%;
		height: 150px;
	}
	&__footer {
		box-sizing: border-box;
		@include font-default(black, 11px);
		padding: 20px;
		position: absolute;
		bottom: 0;
	}
	
}
</style>