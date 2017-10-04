<template>
	<div class="user-menu">
		<div class="user-menu__section">
			<div class="user-menu__header"></div>
		</div>
		<button class="user-menu__button user-menu__button--locations"
			@click="openWindow('locationList')"></button>
		<button class="user-menu__button user-menu__button--closest"
			@click="openWindow('closestLocation')"></button>
		<button class="user-menu__button user-menu__button--categories"
			@click="openWindow('categoryList')"></button>
		<template v-if="!isLoggedIn">
			<button class="user-menu__button user-menu__button--login"
				@click="openLoginForm"></button>
		</template>
		<template v-else>
			<button class="user-menu__button user-menu__button--bookmarks"
				@click="openWindow('bookmarkList')"></button>
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
			this.$store.commit('openForm', 'loginForm')
		},
		openWindow(n) {
			if (n === 'closestLocation') {
			 	this.$emit('openClosestLocation')
			 } else {
			 	this.$store.commit('openWindow', n)
			 } 
			
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
	background-size: 20px;
	position: absolute;
	top: 50%;
	left: 20px;
	transform: translateY(-50%);
	width: 20px;
	height: 20px;
}
@mixin button-text {
	position: absolute;
	top: 50%;
	left: 70px;
	transform: translateY(-50%);
}
/****/
.user-menu {
	background-color: white;
	position: absolute;
	width: 430px;
	min-height: 100vh;
	z-index: 2;
	@media (max-width : 429px) {
		width: 100%;
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
				background-image: url('../assets/location-button.svg');
				content: '';
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
				background-image: url('../assets/list-button.svg');
				content: '';
				@include button-icon;
			}
			&::after {
				content: 'Categories';
				@include font-default(black, 15px);
				@include button-text;
			}
		}
		&--closest {
			&::before {
				background-image: url('../assets/closest-location.svg');
				content: '';
				@include button-icon;
			}
			&::after {
				content: 'Closest Locations';
				@include font-default(black, 15px);
				@include button-text;
			}
		}
		&--login {
			&::before {
				background-image: url('../assets/login-button.svg');
				content: '';
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
				background-image: url('../assets/bookmark-button.svg');
				content: '';
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
				background-image: url('../assets/logout-button.svg');
				content: '';
				@include button-icon;
			}
			&::after {
				content: 'Log Out';
				@include font-default(black, 15px);
				@include button-text;
			}
		}
	}
	&__header {
		background-color: #ccc;
		border-bottom: 1px solid #cccccc;
		box-sizing: border-box;
		width: 100%;
		height: 250px;
	}
	&__footer {
		box-sizing: border-box;
		@include font-default(black, 11px);
		padding: 10px;
		position: absolute;
		bottom: 0;
	}
	
}
</style>