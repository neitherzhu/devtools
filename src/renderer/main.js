import Vue from 'vue'
import axios from 'axios'
import {
  ConfigProvider,
  Button,
  Radio,
  FormModel,
  Input,
  Icon,
  message,
  Modal,
  Tooltip
} from 'ant-design-vue'
import App from './App'
import router from './router'
import store from './store'
import './styles/index.less'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.use(ConfigProvider)
Vue.use(Button)
Vue.use(Radio)
Vue.use(FormModel)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Modal)
Vue.use(Tooltip)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App />'
}).$mount('#app')
