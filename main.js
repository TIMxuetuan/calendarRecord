import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

//引入uviewUI
import uView from "uview-ui";
Vue.use(uView);


const app = new Vue({
    ...App
})
app.$mount()
