<template>
	<div class="social-share-form">
		<div class="social-share-form__button-container">
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
	data() {
		return {
			buttonStyle: {
				'border-radius': '50%',
				width: '100px',
				height: '100px',
			}
		}
	},
	firebase() {
		return {
			location: {
				source: firebase.database().ref('locations').child(this.$route.query.location),
				asObject: true,
			}
		}
	},
	computed: {
		tweetHref() {
			return "https://twitter.com/intent/tweet?text=" + this.title + "&hashtags=" + this.hashtags
		},
		title() {
			return "A " + this.location.category.name + " center in Bantul"
		},
		description() {
			return "A " + this.location.category.name + " center in Bantul"
		},
		hashtags() {
			return this.location.name.replace(/ /g, "") + ", " + this.location.category.name + ", Bantul"
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
		margin-top: 10px;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);
		width: 300px;
	}
	&__button {
		background-color: white;
		border: 1px solid rgba(114, 114, 114, 0.7);
		border-radius: 50%;
		flex: 0 0 100px;
		width: 100px;
		max-width: 100px;
		height: 100px;
		&:focus {
			outline-style: none;
		}
		&--twitter {
			&::before {
				content: 'Twitter';
				font-size: 9px;
				text-align: center;
			}
		}
		&--facebook {
			&::before {
				content: 'Facebook';
				font-size: 9px;
				text-align: center;
				
			}
		}
		&:focus {
			outline-style: none;
		}
	}
}

</style>