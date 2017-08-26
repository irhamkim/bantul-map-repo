.<template>
	<div class="omniform">
		<div v-if="loading" class="auth__loader"></div>
		<button class="omniform__flat-button omniform__flat-button--close"
			@click="closeForm"></button>
		<transition name="fade" mode="out-in">
			<login-form v-if="openForm('loginForm')" key="1"></login-form>
			<forgot-password v-if="openForm('forgotPasswordForm')" key="2"></forgot-password>
			<register-form v-if="openForm('registerForm')" key="3"></register-form>
			<review-form v-if="openForm('reviewForm')" key="4"></review-form>
			<social-share-form v-if="openForm('socialShareForm')"></social-share-form>
		</transition>
	</div>
</template>

<script>
import LoginForm from './LoginForm'
import ForgotPasswordForm from './ForgotPassword'
import RegisterForm from './RegisterForm'
import ReviewForm from './ReviewForm'
import SocialShareForm from './SocialShareForm'
import firebase from '../firebaseConfig'

export default {
	name: 'omniform',
	data() {
		return {
			loading: false,
		}
	},
	beforeMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.loading = true
			}
		})
	},
	components: {
		LoginForm: () => import('./LoginForm'),
		ForgotPassword: () => import('./ForgotPassword'),
		RegisterForm: () => import('./RegisterForm'),
		ReviewForm: () => import('./ReviewForm'),
		SocialShareForm: () => import('./SocialShareForm'),
	},
	methods: {
		openForm(state) {
			return this.$store.state.activeForm === state ? true : false
		},
		closeForm() {
			this.$store.commit('closeForm')
		}
	}
}
</script>

<style lang="scss">
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

.omniform {
	background-color: white;
	border-radius: 5px;
	box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
	box-sizing: border-box;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 500px;
	height: 400px;
	z-index: 6;
	@media (max-width: 499px) {
		border-radius: 0;
		box-shadow: none;
		width: 100%;
		min-height: 100%;
		top: 0;
		left: 0;
		transform: none;
	}
	&__loader {
		background-color: white;
		@include font-default(black, 18px);
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 3;
		&::before {
			content: 'Redirecting...';
			@include center;
		}
	}
	&__flat-button {
		background-color: white;
		border: none;
		&:focus {
			outline-style: none;
		}
		&--close {
			position: absolute;
			top: 15px;
			right: 15px;
			width: 15px;
			height: 15px;
			&::before {
				background: url(../assets/close-button.svg);
				background-size: 15px;
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 15px;
				height: 15px;
			}
		}
	}
}
</style>