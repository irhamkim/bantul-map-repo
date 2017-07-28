<template>
	<div class="user-menu">
		<div class="user-menu__header">
			div.user-menu__image+
		</div>
		<template v-if="!isLoggedIn">
			<button class="user-menu__button user-menu__button--login"
				@click="openLoginForm"></button>
		</template>
		<template v-else>
			<button class="user-menu__button user-menu__button--bookmarks"
				@click="openBookmarkWindow"></button>
			<button class="user-menu__button user-menu__button--logout"
				@click="logOutUser"></button>
		</template>
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
			this.$store.commit('openForm', 'loginForm')
		},
		openBookmarkWindow() {
			this.$store.commit('openWindow', 'bookmarks')
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
@mixin font-default($color, $size) {
	color: $color;
	font-family: Roboto, Helvetica;
	font-size: $size;
}
@mixin center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
@mixin button-text {
	position: absolute;
	top: 50%;
	left: 20px;
	transform: translate(0, -50%);
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
		border-bottom: 1px solid rgb(10, 10, 10);
		position: relative;
		width: 100%;
		height: 90px;
		&:focus {
			outline-style: none;
		}
		&--login {
			&::before {
				content: 'Login';
				@include font-default(black, 17px);
				@include button-text;
			}
		}
		&--bookmarks {
			&::before {
				content: 'Bookmarks';
				@include font-default(black, 17px);
				@include button-text;
			}
		}
		&--logout {
			&::before {
				content: 'Log Out';
				@include font-default(black, 17px);
				@include button-text;
			}
		}
	}
	
	
}
</style>