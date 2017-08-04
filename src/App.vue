<template>
  <div id="app">
  	<transition name="slide-fade-horizontal">
    	<router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .slide-fade-horizontal-enter {
  	opacity: 0;
    left: -50px;
  }

  .slide-fade-horizontal-enter-to {
    opacity: 1;
    left: 0;
  } 

  .slide-fade-horizontal-leave {
    opacity: 1;
    right: 0;
  }

  .slide-fade-horizontal-leave-to {
  	opacity: 0;
    right: -50px;
  }

  .slide-fade-horizontal-enter-active {
  	transition: opacity 0.3s, left 0.3s;
  }

  .slide-fade-horizontal-leave-active {
  	transition: opacity 0.3s, right 0.3s;
  }
</style>
