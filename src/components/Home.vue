<template>
	<div class="home">
		<router-link class="home__item" to="locations">
			<span class="home__text">Locations</span>
		</router-link>
		<router-link class="home__item" to="categories">
			<span class="home__text">Categories</span>
		</router-link>
		<router-link class="home__item" v-if="this.$store.state.user" to="favorites">
			<span class="home__text">Favorites</span>
		</router-link>
	</div>
</template>

<script>
	export default {
		name: 'home'
	}
</script>>

<style lang="scss">
	.home {
		width: 100%;
		height: calc(100% - 70px);
		position: absolute;
		top: 70px;
		&__item {
			border-bottom: 1px solid rgb(42, 159, 71);
			display: inline-block;
			position: relative;
			width: 100%;
			height: 70px;
		}
		&__text {
			color: rgb(42, 159, 71);
			margin-right: -50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>