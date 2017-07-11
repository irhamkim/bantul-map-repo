import Vue from 'vue'
import Router from 'vue-router'
import LocationMap from '@/components/LocationMap'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/map' },
	{ path: '/map', name: 'map', component: LocationMap }
	
  ]
})
