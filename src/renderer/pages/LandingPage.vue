<template>
  <div class="page">
    <a-button type="primary" @click="handleRemoteInspect">真机调试</a-button>
    <div class="help" v-if="showHelp">
      请先安装ADB，<a href="https://atmb.top/guide/adb/install/" target="_blank">查看教程</a>
    </div>
  </div>
</template>

<script>
import cmd from 'node-cmd'

export default {  
  name: 'landing-page',
  data () {
    return {
      showHelp: false,
    }
  },
  mounted () {
    console.log(this.platform)
  },
  methods: {
    handleRemoteInspect () {
      this.getDeviceList(devices => {
        const inspectPage =
          process.env.NODE_ENV !== 'production'
            ? 'http://127.0.0.1:9080/inspect.html'
            : `${__dirname}/inspect.html`
        if (!this.inspectWindow || this.inspectWindow.closed) {
          this.inspectWindow = window.open(inspectPage)
        } else {
          this.inspectWindow.focus()
        }
      })
    },

    /**
     * 检测连接的设备列表
     */
    getDeviceList (callback) {
      cmd.get('adb devices', (err, data, stderr) => {
        if (err) {
          this.showHelp = true
          return this.$message.info(err || '未安装ADB，请根据教程安装ADB')
        }

        let devices = data.split(/\n/g).filter(x => x)
        devices.shift()

        console.log(devices)

        if (!devices.length) {
          return this.$message.info('未检测到设备')
        } else {
          callback && callback(devices)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  padding: 20px;

  .help {
    margin-top: 20px;
  }
}
</style>
