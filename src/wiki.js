import Vue from 'vue';
import vuetify from './plugins/vuetify'
import App from './App.vue';
import WikiStore from './store'

Vue.config.productionTip = false

export default (element, routes) => new Vue({
  vuetify,
  render: h => h(App, {
      props: {
          store: new WikiStore(routes)
      }
  })
}).$mount(element)
