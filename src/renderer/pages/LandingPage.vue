<template>
  <div class="page">
    <a-button type="primary" @click="handleRemoteInspect">真机调试</a-button>
  </div>
</template>

<script>
import cmd from 'node-cmd'

export default {
  name: 'landing-page',

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

        if (!devices.length) {
          return this.$message.info('未检测到设备，请通过USB连接设备后重试')
        } else {
          callback && callback(devices)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../styles/index.less');
.page {
  height: 100vh;
  display: flex;

  .sider {
    width: 200px;
    height: 100%;
    padding: 20px;
    background: @background-color;
    border-right: 1px solid @border-color-base;
  }

  .content {
    position: relative;
    flex: 1;
    height: 100%;
    padding: 20px;
  }

  .create-form {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: @background-color;
  }

  .help {
    margin-top: 20px;
  }
}
</style>
