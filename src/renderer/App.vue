<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'electron-devtools',
  data () {
    return {
      locale: zhCN
    }
  }
}
</script>
