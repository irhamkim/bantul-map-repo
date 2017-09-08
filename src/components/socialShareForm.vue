<template>
	<div class="social-share-form">
		<span class="social-share-form__header">Share to</span>
		<div class="social-share-form__button-container">
			<a :href="gplusHref"
				onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
				<button class="social-share-form__button social-share-form__button--google-plus"></button>
			</a>
			<button class="social-share-form__button social-share-form__button--facebook"
				@click="shareToFb">
			</button>
			<a :href="tweetHref">
				<button class="social-share-form__button social-share-form__button--twitter"></button>
			</a>
		</div>	
	</div>
</template>

<script>
import Vue from 'vue'
import firebase from '../firebaseConfig'

export default {
	name: 'socialShareForm',
	firebase() {
		return {
			location: {
				source: firebase.database().ref('locations').child(this.$route.query.location),
				asObject: true,
			}
		}
	},
	computed: {
		gplusHref() {
			return 'https://plus.google.com/share?url=' + window.location.href
		},
		tweetHref() {
			return 'https://twitter.com/intent/tweet?text=' + this.title + ' ' + window.location.href + ' ' + '&hashtags=' + this.hashtags
		},
		title() {
			return 'A ' + this.location.category.name + ' center in Bantul'
		},
		description() {
			return 'A ' + this.location.category.name + 'center in Bantul'
		},
		hashtags() {
			return this.location.name.replace(/ /g, "") + ', ' + this.location.category.name + ', Bantul'
		}
	},
	methods: {
		shareToFb() {
			FB.ui({
			  method: 'share_open_graph',
			  action_type: 'og.likes',
			  action_properties: JSON.stringify({
			    object:'https://developers.facebook.com/docs/',
			  })
			}, function(response){
			  // Debug response (optional)
			  console.log(response);
			});
		},
	}

}
</script>

<style lang="scss" scoped>
@mixin box-shadow {
	box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
}
@mixin font-default($color, $size, $weight : 100) {
	color: $color;
	font-family: Roboto, Helvetica;
	font-size: $size;
	font-weight: $weight;
}
@mixin center() {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
/***/

.social-share-form {
	display: flex;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 350px;
	height: 220px;
	&__button-container {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 50%);
		width: 100%;
	}
	&__button {
		background-color: white;
		border: none;
		flex: 0 0 70px;
		position: relative;
		width: 70px;
		max-width: 70px;
		height: 70px;
		&:focus {
			outline-style: none;
		}
		&--google-plus {
			&::before {
				background: url('../assets/google-plus.svg');
				background-size: 50px;
				content: '';
				@include center();
				width: 50px;
				height: 50px;
			}
		}
		&--facebook {
			&::before {
				background: url('../assets/facebook.svg');
				background-size: 50px;
				content: '';
				@include center();
				width: 50px;
				height: 50px;
			}
		}
		&--twitter {
			&::before {
				background: url('../assets/twitter.svg');
				background-size: 50px;
				content: '';
				@include center();
				width: 50px;
				height: 50px;
			}
		}
		&:focus {
			outline-style: none;
		}
	}
	&__header {
		@include font-default(black, 19px, 400);
		justify-content: center;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 50%);
	}
}

</style>