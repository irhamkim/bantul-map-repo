import Vue from 'vue'
import Router from 'vue-router'
import LocationMap from '../components/LocationMap'
import Auth from '../components/Auth'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/map' },
	{ path: '/map', name: 'map', component: LocationMap },
	{ path: '/auth', name: 'auth', component: Auth },
	//{ path: '*', name: 'notFound', component: NotFound}
	
  ]
})
