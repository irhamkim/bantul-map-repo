<template>
	<div class="social-share-form">
		<div class="social-share-form__button-container">
			<button class="social-share-form__button--facebook"
				@click="shareToFb">Facebook</button>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import firebase from '../firebaseConfig'

export default {
	name: 'socialShareForm',
	beforeMount() {
		//FB init
		FB.init({
		    appId            : '240139593061293',
		    autoLogAppEvents : true,
		    xfbml            : true,
		    version          : 'v2.10'
		});
		FB.AppEvents.logPageView();

		(function(d, s, id){
		    var js, fjs = d.getElementsByTagName(s)[0];
		    if (d.getElementById(id)) {return;}
		    js = d.createElement(s); js.id = id;
		    js.src = "//connect.facebook.net/en_US/sdk.js";
		    fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
		/***/
	},
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
	&__button {
		border-radius: 50%;
		width: 100px;
		height: 100px;

	}
}

.social-share-form__button {
	border-radius: 50%;
		width: 100px;
		height: 100px;
}

.x {
	background-color: black;
}
</style>