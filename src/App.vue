<template>
  <div id="app">
  	<transition name="slide-fade-horizontal">
    	<router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app',
  created() {
    //FB init
    window.fbAsyncInit = function() {
      FB.init({
          appId            : '240139593061293',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v2.10'
      });
      FB.AppEvents.logPageView()
    }
    /***/
  },
  beforeMount() {
    //Async load fb sdk
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    /****/

    //Async load twitter sdk
    window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[1],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    }(document, "script", "twitter-wjs"))
  },
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
    left: -50%;
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
    right: -50%;
  }

  .slide-fade-horizontal-enter-active {
  	transition: opacity 0.3s, left 0.3s;
  }

  .slide-fade-horizontal-leave-active {
  	transition: opacity 0.3s, right 0.3s;
  }
</style>
